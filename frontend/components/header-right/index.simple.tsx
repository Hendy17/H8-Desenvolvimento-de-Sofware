import React, { useState } from 'react';
import { Modal, Button, TextInput, FileInput, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSettings } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Client } from '@shared/types';
import useHeaderRight from './useHeaderRight';
import styles from './styles.module.css';
import axios from 'axios';

// Versão simplificada temporária do HeaderRight
// TODO: Implementar formulários complexos usando useForm do Mantine
export default function HeaderRight() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const handleClienteDashboard = () => {
    router.push('/cliente');
    closeMenu();
  };

  return (
    <div className={styles.container}>
      <button aria-label="Menu" className={styles.gearButton} onClick={openMenu}>
        <IconSettings />
      </button>
      <div className={styles.spacer} />

      {/* Simplified menu modal */}
      <Modal opened={menuOpen} onClose={closeMenu} title="Opções">
        <Stack gap="md">
          <Button fullWidth variant="filled" onClick={handleClienteDashboard}>
            Dashboard do Cliente
          </Button>
          <Text size="sm" c="dimmed">
            Outras funcionalidades serão implementadas em breve
          </Text>
        </Stack>
      </Modal>
    </div>
  );
}