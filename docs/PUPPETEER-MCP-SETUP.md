# Puppeteer MCP Setup Guide for Klynt

This guide explains how to configure and use Puppeteer MCP (Model Context Protocol) for web automation and UI debugging in the Klynt application.

## Overview

Puppeteer MCP enables AI assistants like Claude to control web browsers programmatically. This is useful for:
- Automated testing of the Klynt web application
- UI debugging and screenshot capture
- Form filling and submission testing
- Performance monitoring
- Cross-browser compatibility testing

## Installation

### Global Installation (Recommended)

Puppeteer and the MCP server have been installed globally for system-wide access:

```bash
# Install globally for all projects
npm install -g puppeteer @modelcontextprotocol/server-puppeteer
```

### Local Installation (Per Project)

For project-specific installations:

```bash
# Install locally in a project
npm install --save-dev @modelcontextprotocol/server-puppeteer puppeteer
```

### Verification

Check global installations:
```bash
npm list -g puppeteer @modelcontextprotocol/server-puppeteer
```

The global MCP server binary is available as: `mcp-server-puppeteer`

## Configuration

### MCP Configuration File

Configuration files have been created with multiple server options:

**Global Configuration** (`~/.config/claude-mcp-global.json`):
```json
{
  "mcpServers": {
    "puppeteer-global": {
      "command": "mcp-server-puppeteer",
      "args": [],
      "env": {
        "PUPPETEER_LAUNCH_OPTIONS": "{ \"headless\": false }"
      }
    },
    "puppeteer-headless": {
      "command": "mcp-server-puppeteer",
      "args": [],
      "env": {
        "PUPPETEER_LAUNCH_OPTIONS": "{ \"headless\": true }"
      }
    }
  }
}
```

**Project-specific Configuration** (`/mcp-config.json`):
```json
{
  "mcpServers": {
    "klynt-puppeteer-global": {
      "command": "mcp-server-puppeteer",
      "args": [],
      "env": {
        "PUPPETEER_LAUNCH_OPTIONS": "{ \"headless\": false }"
      }
    },
    "klynt-puppeteer-npx": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {
        "PUPPETEER_LAUNCH_OPTIONS": "{ \"headless\": false }"
      }
    }
  }
}
```

### Claude Desktop Integration

To use Puppeteer MCP with Claude Desktop:

1. Copy the configuration from `mcp-config.json`
2. Add it to Claude Desktop's configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

3. Restart Claude Desktop for changes to take effect

## Available Tools

When connected, the Puppeteer MCP server provides these tools:

### 1. `puppeteer_navigate`
Navigate to a URL
```
Arguments:
- url: The URL to navigate to
```

### 2. `puppeteer_screenshot`
Take a screenshot of the page or specific element
```
Arguments:
- fullPage: Whether to capture the full page (optional)
- selector: CSS selector of element to screenshot (optional)
```

### 3. `puppeteer_click`
Click on an element
```
Arguments:
- selector: CSS selector of the element to click
```

### 4. `puppeteer_fill`
Fill a form field
```
Arguments:
- selector: CSS selector of the input field
- value: Value to fill in the field
```

### 5. `puppeteer_evaluate`
Execute JavaScript in the browser context
```
Arguments:
- script: JavaScript code to execute
```

### 6. `puppeteer_select`
Select elements on the page
```
Arguments:
- selector: CSS selector to match elements
```

### 7. `puppeteer_hover`
Hover over an element
```
Arguments:
- selector: CSS selector of the element to hover
```

## Usage Examples

### Basic Form Testing

```javascript
// Navigate to Klynt app
await puppeteer_navigate({ url: "http://localhost:5173" });

// Fill single item order form
await puppeteer_click({ selector: "button:contains('Single Item Order')" });
await puppeteer_fill({ selector: "input[name='name']", value: "John Doe" });
await puppeteer_fill({ selector: "input[name='email']", value: "john@example.com" });
await puppeteer_fill({ selector: "input[name='phone']", value: "868-555-0123" });
await puppeteer_fill({ selector: "input[name='productLink']", value: "https://www.amazon.com/test-product" });

// Take screenshot
await puppeteer_screenshot({ fullPage: true });

// Submit form
await puppeteer_click({ selector: "button[type='submit']" });
```

### Performance Testing

```javascript
// Navigate and measure performance
await puppeteer_navigate({ url: "http://localhost:5173" });

// Get performance metrics
const metrics = await puppeteer_evaluate({
  script: `(() => {
    const perf = window.performance;
    return {
      loadTime: perf.timing.loadEventEnd - perf.timing.navigationStart,
      domReady: perf.timing.domContentLoadedEventEnd - perf.timing.navigationStart,
      resources: perf.getEntriesByType('resource').length
    };
  })()`
});
```

## Test Scripts

### Automated Test Runner

A test runner script is available at `/mcp-servers/puppeteer/test-klynt.js`:

```bash
# Run automated tests
node mcp-servers/puppeteer/test-klynt.js
```

This script will:
1. Load the homepage
2. Test single item order form
3. Check mobile responsiveness
4. Measure performance metrics
5. Generate screenshots

### Example Automation Scripts

Additional example scripts are available at `/mcp-servers/puppeteer/examples/klynt-automation.js`:

- `testSingleItemOrder()`: Tests single item order flow
- `testMultiItemOrder()`: Tests multi-item order flow
- `testOrderTracking()`: Tests order tracking functionality
- `testMobileView()`: Tests responsive design
- `testFormValidation()`: Tests form validation
- `testPerformance()`: Measures performance metrics

## Troubleshooting

### Common Issues

1. **Browser doesn't launch**
   - Ensure Chrome/Chromium is installed
   - Try setting `headless: true` in launch options
   - Check for sandbox issues on Linux

2. **Timeout errors**
   - Increase timeout values in wait operations
   - Ensure the development server is running
   - Check network connectivity

3. **Element not found**
   - Verify CSS selectors are correct
   - Add wait operations before interactions
   - Check if elements are dynamically loaded

### Debug Mode

To run in debug mode with visible browser:
```json
{
  "PUPPETEER_LAUNCH_OPTIONS": "{ \"headless\": false, \"devtools\": true }"
}
```

## Best Practices

1. **Always wait for elements** before interacting with them
2. **Use specific selectors** to avoid ambiguity
3. **Add error handling** for failed operations
4. **Take screenshots** at key points for debugging
5. **Clean up resources** by closing browser when done
6. **Run tests in headless mode** for CI/CD pipelines

## Security Considerations

- Never store sensitive data in automation scripts
- Use environment variables for credentials
- Run Puppeteer with sandbox enabled in production
- Limit browser permissions appropriately
- Validate all input data before automation

## Next Steps

1. Configure Claude Desktop with the MCP server
2. Run the test suite to verify setup
3. Create custom automation scripts for specific workflows
4. Integrate with CI/CD pipeline for automated testing
5. Monitor performance metrics regularly

For more information about MCP, visit: https://modelcontextprotocol.io/