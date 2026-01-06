import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  describe('初期表示', () => {
    it('デフォルトでsecondaryバリアント、mediumサイズで表示される', () => {
      render(<Button>テストボタン</Button>);

      const button = screen.getByRole('button', { name: 'テストボタン' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-gray-200', 'text-gray-800', 'px-5', 'py-2.5', 'text-sm');
    });

    it('primaryバリアントを指定すると対応するクラスが適用される', () => {
      render(<Button variant="primary">プライマリ</Button>);

      const button = screen.getByRole('button', { name: 'プライマリ' });
      expect(button).toHaveClass('bg-blue-500', 'text-white');
    });

    it('secondaryバリアントを指定すると対応するクラスが適用される', () => {
      render(<Button variant="secondary">セカンダリ</Button>);

      const button = screen.getByRole('button', { name: 'セカンダリ' });
      expect(button).toHaveClass('bg-gray-200', 'text-gray-800');
    });

    it('dangerバリアントを指定すると対応するクラスが適用される', () => {
      render(<Button variant="danger">削除</Button>);

      const button = screen.getByRole('button', { name: '削除' });
      expect(button).toHaveClass('bg-rose-600', 'text-white');
    });

    it('smallサイズを指定すると対応するクラスが適用される', () => {
      render(<Button size="small">小さいボタン</Button>);

      const button = screen.getByRole('button', { name: '小さいボタン' });
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-xs');
    });

    it('mediumサイズを指定すると対応するクラスが適用される', () => {
      render(<Button size="medium">中サイズボタン</Button>);

      const button = screen.getByRole('button', { name: '中サイズボタン' });
      expect(button).toHaveClass('px-5', 'py-2.5', 'text-sm');
    });

    it('カスタムクラス名を追加できる', () => {
      render(<Button className="custom-class">カスタム</Button>);

      const button = screen.getByRole('button', { name: 'カスタム' });
      expect(button).toHaveClass('custom-class');
    });

    it('disabled属性を設定できる', () => {
      render(<Button disabled>無効ボタン</Button>);

      const button = screen.getByRole('button', { name: '無効ボタン' });
      expect(button).toBeDisabled();
    });

    it('type属性を設定できる', () => {
      render(<Button type="submit">送信</Button>);

      const button = screen.getByRole('button', { name: '送信' });
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('操作', () => {
    it('クリックすると指定したハンドラーが呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>クリック</Button>);

      const button = screen.getByRole('button', { name: 'クリック' });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabled状態ではクリックイベントが発火しない', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} disabled>無効</Button>);

      const button = screen.getByRole('button', { name: '無効' });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
