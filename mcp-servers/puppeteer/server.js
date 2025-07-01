#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import puppeteer from 'puppeteer';

// Initialize browser state
let browser = null;
let page = null;

// Helper function to ensure browser is initialized
async function ensureBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  if (!page) {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  }
  return { browser, page };
}

// Create server
const server = new Server({
  name: 'klynt-puppeteer-server',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Handle tool listing
server.setRequestHandler({
  method: 'tools/list',
  handler: async () => ({
    tools: [
      {
        name: 'navigate',
        description: 'Navigate to a URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to navigate to'
            }
          },
          required: ['url']
        }
      },
      {
        name: 'screenshot',
        description: 'Take a screenshot of the current page',
        inputSchema: {
          type: 'object',
          properties: {
            fullPage: {
              type: 'boolean',
              description: 'Whether to capture the full page',
              default: false
            },
            selector: {
              type: 'string',
              description: 'CSS selector of element to screenshot (optional)'
            }
          }
        }
      },
      {
        name: 'click',
        description: 'Click on an element',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector of the element to click'
            }
          },
          required: ['selector']
        }
      },
      {
        name: 'fill',
        description: 'Fill a form field',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector of the input field'
            },
            value: {
              type: 'string',
              description: 'Value to fill in the field'
            }
          },
          required: ['selector', 'value']
        }
      },
      {
        name: 'evaluate',
        description: 'Execute JavaScript in the browser context',
        inputSchema: {
          type: 'object',
          properties: {
            script: {
              type: 'string',
              description: 'JavaScript code to execute'
            }
          },
          required: ['script']
        }
      },
      {
        name: 'getContent',
        description: 'Get the current page HTML content',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector to get content from (optional)'
            }
          }
        }
      },
      {
        name: 'waitFor',
        description: 'Wait for an element to appear',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector to wait for'
            },
            timeout: {
              type: 'number',
              description: 'Maximum time to wait in milliseconds',
              default: 30000
            }
          },
          required: ['selector']
        }
      },
      {
        name: 'close',
        description: 'Close the browser',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  })
});

// Handle tool calls
server.setRequestHandler({
  method: 'tools/call',
  handler: async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      switch (name) {
        case 'navigate': {
          const { page } = await ensureBrowser();
          await page.goto(args.url, { waitUntil: 'networkidle2' });
          return {
            content: [{
              type: 'text',
              text: `Navigated to ${args.url}`
            }]
          };
        }
        
        case 'screenshot': {
          const { page } = await ensureBrowser();
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `screenshot-${timestamp}.png`;
          
          if (args.selector) {
            const element = await page.$(args.selector);
            if (element) {
              await element.screenshot({ path: filename });
            } else {
              throw new Error(`Element not found: ${args.selector}`);
            }
          } else {
            await page.screenshot({ path: filename, fullPage: args.fullPage || false });
          }
          
          return {
            content: [{
              type: 'text',
              text: `Screenshot saved to ${filename}`
            }]
          };
        }
        
        case 'click': {
          const { page } = await ensureBrowser();
          await page.click(args.selector);
          return {
            content: [{
              type: 'text',
              text: `Clicked element: ${args.selector}`
            }]
          };
        }
        
        case 'fill': {
          const { page } = await ensureBrowser();
          await page.type(args.selector, args.value);
          return {
            content: [{
              type: 'text',
              text: `Filled ${args.selector} with: ${args.value}`
            }]
          };
        }
        
        case 'evaluate': {
          const { page } = await ensureBrowser();
          const result = await page.evaluate(args.script);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }]
          };
        }
        
        case 'getContent': {
          const { page } = await ensureBrowser();
          let content;
          
          if (args.selector) {
            content = await page.$eval(args.selector, el => el.innerHTML);
          } else {
            content = await page.content();
          }
          
          return {
            content: [{
              type: 'text',
              text: content
            }]
          };
        }
        
        case 'waitFor': {
          const { page } = await ensureBrowser();
          await page.waitForSelector(args.selector, { timeout: args.timeout || 30000 });
          return {
            content: [{
              type: 'text',
              text: `Element found: ${args.selector}`
            }]
          };
        }
        
        case 'close': {
          if (browser) {
            await browser.close();
            browser = null;
            page = null;
          }
          return {
            content: [{
              type: 'text',
              text: 'Browser closed'
            }]
          };
        }
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
});

// Cleanup on exit
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit();
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Klynt Puppeteer MCP server running...');