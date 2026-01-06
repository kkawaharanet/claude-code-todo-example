import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LinkButton from './LinkButton';

describe('LinkButton', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );

  describe('初期表示', () => {
    it('デフォルトでsecondaryバリアント、mediumサイズで表示される', () => {
      render(<LinkButton to="/test">テストリンク</LinkButton>, { wrapper });

      const link = screen.getByRole('link', { name: 'テストリンク' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('bg-gray-200', 'text-gray-800', 'px-5', 'py-2.5', 'text-sm');
    });

    it('primaryバリアントを指定すると対応するクラスが適用される', () => {
      render(<LinkButton to="/test" variant="primary">プライマリ</LinkButton>, { wrapper });

      const link = screen.getByRole('link', { name: 'プライマリ' });
      expect(link).toHaveClass('bg-blue-500', 'text-white');
    });

    it('secondaryバリアントを指定すると対応するクラスが適用される', () => {
      render(<LinkButton to="/test" variant="secondary">セカンダリ</LinkButton>, { wrapper });

      const link = screen.getByRole('link', { name: 'セカンダリ' });
      expect(link).toHaveClass('bg-gray-200', 'text-gray-800');
    });

    it('dangerバリアントを指定すると対応するクラスが適用される', () => {
      render(<LinkButton to="/test" variant="danger">削除</LinkButton>, { wrapper });

      const link = screen.getByRole('link', { name: '削除' });
      expect(link).toHaveClass('bg-rose-600', 'text-white');
    });

    it('smallサイズを指定すると対応するクラスが適用される', () => {
      render(<LinkButton to="/test" size="small">小さいリンク</LinkButton>, { wrapper });

      const link = screen.getByRole('link', { name: '小さいリンク' });
      expect(link).toHaveClass('px-3', 'py-1.5', 'text-xs');
    });

    it('mediumサイズを指定すると対応するクラスが適用される', () => {
      render(<LinkButton to="/test" size="medium">中サイズリンク</LinkButton>, { wrapper });

      const link = screen.getByRole('link', { name: '中サイズリンク' });
      expect(link).toHaveClass('px-5', 'py-2.5', 'text-sm');
    });

    it('カスタムクラス名を追加できる', () => {
      render(<LinkButton to="/test" className="custom-class">カスタム</LinkButton>, { wrapper });

      const link = screen.getByRole('link', { name: 'カスタム' });
      expect(link).toHaveClass('custom-class');
    });

    it('指定したtoプロパティのパスが設定される', () => {
      render(<LinkButton to="/custom-path">リンク</LinkButton>, { wrapper });

      const link = screen.getByRole('link', { name: 'リンク' });
      expect(link).toHaveAttribute('href', '/custom-path');
    });
  });
});
