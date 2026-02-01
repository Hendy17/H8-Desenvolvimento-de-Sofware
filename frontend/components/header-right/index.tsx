import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Modal, Button, Form, Input, notification, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { Client } from '@shared/types';
import useHeaderRight from './useHeaderRight';
import styles from './styles.module.css';
import axios from 'axios';

// helper: allow only digits and format as CNPJ while typing: 00.000.000/0000-00
const onlyDigits = (v?: string) => (v || '').toString().replace(/\D/g, '');
function formatCNPJ(value?: string) {
  const d = onlyDigits(value).slice(0, 14);
  if (!d) return '';
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`;
}

export default function HeaderRight() {
  const router = useRouter();
  const { visible, open, close, onSubmit, loading, client, search } = useHeaderRight();
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const handleOpenSearch = () => {
    closeMenu();
    open();
  };

  const handleSearchSubmit = async (values: any) => {
    const cnpj = onlyDigits(values.cnpj);
    if (cnpj.length !== 14) {
      notification.warning({ message: 'CNPJ deve ter 14 dígitos' });
      return;
    }
    try {
      await search(cnpj);
      close();
      router.push(`/cliente/${cnpj}`);
    } catch (err: any) {
      notification.error({ message: err?.response?.data?.message || 'Erro ao buscar cliente' });
    }
  };

  const handleOpenCreate = () => {
    closeMenu();
    setCreateOpen(true);
  };

  const handleOpenUpload = () => {
    closeMenu();
    setUploadOpen(true);
  };

  const handleCreateSubmit = async (values: any) => {
    const cnpj = (values.cnpj || '').replace(/\D/g, '');
    const name = values.name || '';
    const address = values.address || '';
    if (!cnpj || !name) return notification.warning({ message: 'CNPJ e Nome são obrigatórios' });
    setCreating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await axios.post<Client>(`${apiUrl}/clients`, { cnpj, name, address });
      notification.success({ message: 'Cliente criado', description: res.data.name || '' });
      setCreateOpen(false);
    } catch (err: any) {
      notification.error({ message: err?.response?.data?.message || 'Erro ao criar cliente' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.container}>
      <button aria-label="Menu" className={styles.gearButton} onClick={openMenu}>
        <SettingOutlined />
      </button>
      <div className={styles.spacer} />

      {/* Main menu modal with two actions */}
      <Modal visible={menuOpen} onCancel={closeMenu} footer={null} title="Escolha uma ação">
        <div className={styles.menuActions}>
          <Button block type="primary" onClick={handleOpenCreate} className={styles.primary}>Cadastrar novo cliente</Button>
          <Button block onClick={handleOpenSearch} className={styles.secondary}>Buscar CNPJ</Button>
          <Button block onClick={handleOpenUpload} className={styles.secondary}>Anexar planilhas</Button>
        </div>
      </Modal>

      {/* Search modal (existing) */}
      <Modal visible={visible} onCancel={close} footer={null} title="Pesquisar Cliente por CNPJ">
        <Form layout="vertical" onFinish={handleSearchSubmit}>
          <Form.Item
            name="cnpj"
            label="CNPJ"
            rules={[
              { required: true, message: 'Informe o CNPJ' },
              { validator: (_, val) => {
                const digits = onlyDigits(val);
                return digits.length === 14 ? Promise.resolve() : Promise.reject('CNPJ deve ter 14 dígitos');
              }}
            ]}
            normalize={(val) => formatCNPJ(val)}
          >
            <Input placeholder="CNPJ (somente números)" inputMode="numeric" maxLength={18} />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={close}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>{loading ? 'Buscando...' : 'Buscar'}</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Attachments modal */}
      <Modal visible={attachmentsOpen} onCancel={() => setAttachmentsOpen(false)} title="Anexos" footer={null} width={700}>
        {attachments.length === 0 ? (
          <div>Nenhum anexo encontrado.</div>
        ) : (
          <div>
            {attachments.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid #eee' }}>
                <div>
                  <div><strong>{a.originalname}</strong></div>
                  <div style={{ fontSize: 12, color: '#666' }}>{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/clients/attachments/${a.id}/download`} target="_blank" rel="noreferrer">
                    <Button>Download</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Create client modal */}
      <Modal visible={createOpen} onCancel={() => setCreateOpen(false)} title="Cadastrar Novo Cliente" footer={null}>
        <Form layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item
            name="cnpj"
            label="CNPJ"
            rules={[
              { required: true, message: 'Informe o CNPJ' },
              { validator: (_, val) => {
                const digits = onlyDigits(val);
                return digits.length === 14 ? Promise.resolve() : Promise.reject('CNPJ deve ter 14 dígitos');
              }}
            ]}
            normalize={(val) => formatCNPJ(val)}
          >
            <Input placeholder="CNPJ (somente números)" inputMode="numeric" maxLength={18} />
          </Form.Item>
          <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}>
            <Input placeholder="Nome do cliente" />
          </Form.Item>
          <Form.Item name="address" label="Endereço">
            <Input placeholder="Endereço" />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={creating}>{creating ? 'Criando...' : 'Cadastrar'}</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Upload modal */}
      <Modal visible={uploadOpen} onCancel={() => setUploadOpen(false)} title="Anexar planilhas" footer={null}>
        <Form layout="vertical" onFinish={async (values) => {
          const cnpj = (values.cnpj || '').replace(/\D/g, '');
          if (!cnpj) return notification.warning({ message: 'Informe o CNPJ' });
          if (!fileList || fileList.length === 0) return notification.warning({ message: 'Selecione ao menos um arquivo' });
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            for (const f of fileList) {
              const form = new FormData();
              // @ts-ignore
              form.append('file', f.originFileObj);
              await axios.post(`${apiUrl}/clients/attachments/${cnpj}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            notification.success({ message: 'Arquivos enviados' });
            setUploadOpen(false);
            setFileList([]);
          } catch (err: any) {
            notification.error({ message: err?.response?.data?.message || 'Erro ao enviar arquivos' });
          }
        }}>
          <Form.Item
            name="cnpj"
            label="CNPJ"
            rules={[
              { required: true, message: 'Informe o CNPJ' },
              { validator: (_, val) => {
                const digits = onlyDigits(val);
                return digits.length === 14 ? Promise.resolve() : Promise.reject('CNPJ deve ter 14 dígitos');
              }}
            ]}
            normalize={(val) => formatCNPJ(val)}
          >
            <Input placeholder="CNPJ (somente números)" inputMode="numeric" maxLength={18} />
          </Form.Item>
          <Form.Item label="Arquivos">
            <Upload beforeUpload={() => false} multiple fileList={fileList} onChange={({ fileList: fl }) => setFileList(fl)}>
              <Button>Selecionar arquivos</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setUploadOpen(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">Enviar</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
