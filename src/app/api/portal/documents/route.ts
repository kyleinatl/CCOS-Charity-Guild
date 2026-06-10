import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { findPortalAccount, getPortalSessionCookieName, readPortalSessionToken } from '@/lib/auth/portal-session';

async function getActiveAccount(request: NextRequest) {
  const token = request.cookies.get(getPortalSessionCookieName())?.value;
  const session = readPortalSessionToken(token);

  if (!session) {
    return null;
  }

  return findPortalAccount(session.username);
}

export async function GET(request: NextRequest) {
  const account = await getActiveAccount(request);
  if (!account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient() as any;
  const { data, error } = await (supabase as any)
    .from('portal_documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const documents = await Promise.all((data || []).map(async (document) => {
    if (!document.file_path) {
      return document;
    }

    const { data: signedUrl } = await supabase.storage
      .from('portal-documents')
      .createSignedUrl(document.file_path, 60 * 60);

    return {
      ...document,
      file_url: signedUrl?.signedUrl || null,
    };
  }));

  return NextResponse.json({ documents });
}

export async function POST(request: NextRequest) {
  const account = await getActiveAccount(request);
  if (!account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const title = String(formData.get('title') || '').trim();
  const documentType = String(formData.get('document_type') || formData.get('type') || 'other');
  const description = String(formData.get('description') || '').trim();
  const file = formData.get('file');

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'A file is required' }, { status: 400 });
  }

  const supabase = createAdminClient() as any;
  await (supabase as any).storage.createBucket('portal-documents', { public: false }).catch(() => null);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
  const filePath = `${account.username.replace(/[^a-zA-Z0-9._-]+/g, '_')}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await (supabase as any).storage
    .from('portal-documents')
    .upload(filePath, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data, error } = await (supabase as any)
    .from('portal_documents')
    .insert([
      {
        title,
        document_type: documentType,
        description: description || null,
        file_name: file.name,
        file_path: filePath,
        file_url: null,
        uploaded_by: account.email,
        is_public: false,
      },
    ])
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ document: data }, { status: 201 });
}
