import fs from 'fs';
import path from 'path';

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      walk(path.join(dir, file), fileList);
    } else if (file === 'route.ts') {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const apiDir = path.join(process.cwd(), 'src/api-handlers');
const routes = walk(apiDir);

let imports = '';
let routeDefs = '';

let counter = 0;
for (const file of routes) {
  const relativePath = path.relative(apiDir, file);
  
  const apiPath = '/api/' + relativePath.replace(/\/route\.ts$/, '');
  const importPath = '@/api-handlers/' + relativePath.replace(/\.ts$/, '');
  
  const varName = 'route' + counter++;
  imports += `import * as ${varName} from '${importPath}';\n`;
  routeDefs += `  { pattern: '${apiPath}', handlers: ${varName} as any },\n`;
}

const routerCode = `import { NextResponse } from 'next/server';

${imports}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const paramNames: string[] = [];
  const regexStr = pattern.replace(/\\[([^\\]]+)\\]/g, (_, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });
  const regex = new RegExp('^' + regexStr + '$');
  const match = pathname.match(regex);
  if (!match) return null;
  const params: Record<string, string> = {};
  paramNames.forEach((name, i) => {
    params[name] = match[i + 1];
  });
  return params;
}

const routes = [
${routeDefs}
];

async function handleRequest(req: Request) {
  try {
    const url = new URL(req.url);
    // Remove trailing slash for exact matching if it exists and path != /
    let pathname = url.pathname;
    if (pathname.endsWith('/') && pathname !== '/') {
      pathname = pathname.slice(0, -1);
    }

    for (const route of routes) {
      const paramsObj = matchPath(route.pattern, pathname);
      if (paramsObj) {
        const method = req.method;
        const handler = route.handlers[method];
        if (handler) {
          const params = Promise.resolve(paramsObj);
          return await handler(req, { params });
        }
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
      }
    }
    return NextResponse.json({ error: 'Not Found: ' + pathname }, { status: 404 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
`;

fs.writeFileSync(path.join(process.cwd(), 'scripts/generated-router.ts'), routerCode);
console.log('Router generated');
