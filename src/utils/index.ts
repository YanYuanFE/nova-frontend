import { getIconForFile } from 'vscode-icons-js';

export function getIconForFileName(name: string) {
  // 判断name以.cairo结尾
  if (name.endsWith('.cairo')) {
    return 'file_type_cairo.png';
  }
  return getIconForFile(name);
}

export function validateName(newName: string, oldName: string, type: 'file' | 'folder') {
  if (newName === oldName || newName.length === 0) {
    return { status: false, message: '' };
  }
  if (
    newName.includes('/') ||
    newName.includes('\\') ||
    newName.includes(' ') ||
    (type === 'file' && !newName.includes('.')) ||
    (type === 'folder' && newName.includes('.'))
  ) {
    return { status: false, message: 'Invalid file name.' };
  }
  return { status: true, message: '' };
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  } as T;
}

export function processFileType(file: string) {
  const ending = file.split('.').pop();

  if (ending === 'ts' || ending === 'tsx') return 'typescript';
  if (ending === 'js' || ending === 'jsx') return 'javascript';

  if (ending) return ending;
  return 'plaintext';
}

export const shortenAddress = (address?: string) => {
  if (!address) return null;
  return `${address?.substring(0, 6)}...${address?.substring(address.length - 4, address.length)}`;
};
