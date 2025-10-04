import { createContext, useContext } from 'react';

interface DeleteModeContextType {
  isDeleteMode: boolean;
  setDeleteMode: (mode: boolean) => void;
}

export const DeleteModeContext = createContext<DeleteModeContextType | undefined>(undefined);

export const useDeleteMode = () => {
  const context = useContext(DeleteModeContext);
  if (!context) {
    throw new Error('useDeleteMode must be used within a DeleteModeProvider');
  }
  return context;
};
