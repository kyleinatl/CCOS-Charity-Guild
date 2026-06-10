-- Portal document library for board minutes and uploads

CREATE TYPE portal_document_type AS ENUM ('minutes', 'form', 'policy', 'other');

CREATE TABLE portal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    document_type portal_document_type NOT NULL DEFAULT 'other',
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT,
    file_url TEXT,
    uploaded_by VARCHAR(255),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_portal_documents_type ON portal_documents(document_type);
CREATE INDEX idx_portal_documents_created_at ON portal_documents(created_at);
