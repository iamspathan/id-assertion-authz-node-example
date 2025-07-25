import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: 'todo',
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {}
  }
})


server.registerResource(
  "allTodo",
  "todo://all",

)
