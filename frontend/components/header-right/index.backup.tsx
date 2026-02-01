// Backup do arquivo header-right original antes da conversão para Mantine
// Este arquivo contém as formas complexas do Ant Design que precisam ser convertidas

import React, { useState } from 'react';
import { Modal, Button, TextInput, FileInput, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSettings } from '@tabler/icons-react';
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
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

// Este componente precisa ser convertido completamente para usar useForm do Mantine
// em vez dos Forms complexos do Ant Design
export default function HeaderRight() {
  // Versão simplificada temporária
  return (
    <div className={styles.container}>
      <Text size="sm">Header Right - Em conversão para Mantine</Text>
    </div>
  );
}