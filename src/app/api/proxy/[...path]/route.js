import { NextResponse } from 'next/server';

const API_TARGET = 'http://130.107.74.13:8080';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'GET');
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'POST');
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'PUT');
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams, 'DELETE');
}

async function proxyRequest(request, params, method) {
  try {
    const pathArray = params.path || [];
    const pathString = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;
    
    const url = new URL(request.url);
    const targetUrl = `${API_TARGET}/${pathString}${url.search}`;

    console.log(`[Proxy] ${method} ${targetUrl}`);

    const headers = {
      'Content-Type': 'application/json',
    };
    
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const fetchOptions = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'DELETE') {
      const body = await request.text();
      if (body) {
        fetchOptions.body = body;
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    
    const contentType = response.headers.get('content-type') || '';
    let data;
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log(`[Proxy] Status: ${response.status}`);

    return NextResponse.json(data, {
      status: response.status,
    });
    
  } catch (error) {
    console.error('[Proxy] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao comunicar com a API', details: error.message },
      { status: 500 }
    );
  }
}