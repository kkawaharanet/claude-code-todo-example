import { test, expect } from '@playwright/test';

test.describe('TODO アプリケーション E2E テスト', () => {
  test.beforeEach(async ({ page }) => {
    // メモリストレージを使用しているため、ページ遷移で初期状態に戻る
    await page.goto('/');
  });

  test('1. /にアクセスしたとき、TODO一覧表示画面が表示されること', async ({ page }) => {
    await page.goto('/');

    // TODO一覧のタイトルが表示されることを確認
    await expect(page.locator('h1')).toHaveText('TODO 一覧');

    // 新規TODO作成ボタンが表示されることを確認
    await expect(page.getByRole('link', { name: '新規TODO作成' })).toBeVisible();
  });

  test('2. 新規TODO作成ボタンを押したとき、TODO作成画面が表示されること', async ({ page }) => {
    await page.goto('/');

    // 新規TODO作成ボタンをクリック
    await page.getByRole('link', { name: '新規TODO作成' }).click();

    // TODO作成画面のタイトルが表示されることを確認
    await expect(page.locator('h1')).toHaveText('TODO 作成');

    // フォームの各項目が表示されることを確認
    await expect(page.getByLabel('題名 *')).toBeVisible();
    await expect(page.getByLabel('説明')).toBeVisible();
    await expect(page.getByLabel('状態 *')).toBeVisible();
    await expect(page.getByLabel('担当者')).toBeVisible();
    await expect(page.getByLabel('期限')).toBeVisible();
  });

  test('3. TODO作成画面にあるキャンセルボタンを押したとき、TODO一覧表示画面に戻ること', async ({ page }) => {
    await page.goto('/create');

    // キャンセルボタンをクリック
    await page.getByRole('button', { name: 'キャンセル' }).click();

    // TODO一覧画面に戻ることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('TODO 一覧');
  });

  test('4. TODO作成画面で全ての項目を入力し作成ボタンを押したとき、TODOが登録されたTODO一覧表示画面が表示されること', async ({ page }) => {
    await page.goto('/create');

    // フォームに入力
    await page.getByLabel('題名 *').fill('新規作成TODO');
    await page.getByLabel('説明').fill('これはテストの説明です');
    await page.getByLabel('状態 *').selectOption('実施中');
    await page.getByLabel('担当者').fill('佐藤花子');
    await page.getByLabel('期限').fill('2026-12-31');

    // 作成ボタンをクリック
    await page.getByRole('button', { name: '作成' }).click();

    // TODO一覧画面に戻ることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('TODO 一覧');

    // 作成したTODOが表示されることを確認
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('新規作成TODO')).toBeVisible();
    await expect(page.getByText('佐藤花子')).toBeVisible();
  });

  test('5. TODO一覧表示画面にあるTODOの編集ボタンを押したとき、TODO編集画面が表示されること', async ({ page }) => {
    // サンプルTODOの編集ボタンをクリック
    await page.getByRole('link', { name: '編集' }).first().click();

    // TODO編集画面が表示されることを確認
    await expect(page.locator('h1')).toHaveText('TODO 編集');

    // フォームに既存の値（サンプルTODO）が入っていることを確認
    await expect(page.getByLabel('題名 *')).toHaveValue('サンプルTODO');
    await expect(page.getByLabel('説明')).toHaveValue('これはサンプルのTODOです');
    await expect(page.getByLabel('担当者')).toHaveValue('山田太郎');
    await expect(page.getByLabel('期限')).toHaveValue('2026-01-10');
  });

  test('6. TODO編集画面にあるキャンセルボタンを押したとき、TODO一覧表示画面に戻ること', async ({ page }) => {
    // サンプルTODOの編集画面に移動
    await page.getByRole('link', { name: '編集' }).first().click();

    // キャンセルボタンをクリック
    await page.getByRole('button', { name: 'キャンセル' }).click();

    // TODO一覧画面に戻ることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('TODO 一覧');
  });

  test('7. TODO編集画面で全ての項目を入力し更新ボタンを押したとき、TODOが更新されたTODO一覧表示画面が表示されること', async ({ page }) => {
    // サンプルTODOの編集画面に移動
    await page.getByRole('link', { name: '編集' }).first().click();

    // フォームを更新
    await page.getByLabel('題名 *').fill('更新後サンプルTODO');
    await page.getByLabel('説明').fill('更新後の説明');
    await page.getByLabel('状態 *').selectOption('完了');
    await page.getByLabel('担当者').fill('鈴木一郎');
    await page.getByLabel('期限').fill('2026-06-30');

    // 更新ボタンをクリック
    await page.getByRole('button', { name: '更新' }).click();

    // TODO一覧画面に戻ることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('TODO 一覧');

    // 更新されたTODOが表示されることを確認
    await expect(page.getByText('更新後サンプルTODO')).toBeVisible();
    await expect(page.getByText('鈴木一郎')).toBeVisible();

    // 古い値が表示されないことを確認
    await expect(page.getByText('山田太郎')).not.toBeVisible();
  });

  test('8. TODO一覧表示画面にあるTODOの削除ボタンを押したとき、TODO削除確認画面が表示されること', async ({ page }) => {
    // サンプルTODOの削除ボタンをクリック
    await page.getByRole('link', { name: '削除' }).first().click();

    // TODO削除確認画面が表示されることを確認
    await expect(page.locator('h1')).toHaveText('TODO 削除確認');
    await expect(page.getByText('以下のTODOを削除してもよろしいですか?')).toBeVisible();

    // サンプルTODOの詳細が表示されることを確認
    await expect(page.getByText('サンプルTODO')).toBeVisible();
    await expect(page.getByText('これはサンプルのTODOです')).toBeVisible();
  });

  test('9. TODO削除確認画面にあるキャンセルボタンを押したとき、TODO一覧表示画面に戻ること', async ({ page }) => {
    // サンプルTODOの削除確認画面に移動
    await page.getByRole('link', { name: '削除' }).first().click();

    // キャンセルボタンをクリック
    await page.getByRole('button', { name: 'キャンセル' }).click();

    // TODO一覧画面に戻ることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('TODO 一覧');

    // サンプルTODOが削除されていないことを確認
    await expect(page.getByText('サンプルTODO')).toBeVisible();
  });

  test('10. TODO削除確認画面にある削除ボタンを押したとき、TODOが削除されたTODO一覧表示画面が表示されること', async ({ page }) => {
    // サンプルTODOが表示されることを確認
    await expect(page.getByText('サンプルTODO')).toBeVisible();

    // サンプルTODOの削除確認画面に移動
    await page.getByRole('link', { name: '削除' }).first().click();

    // 削除ボタンをクリック
    await page.getByRole('button', { name: '削除' }).click();

    // TODO一覧画面に戻ることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('TODO 一覧');

    // サンプルTODOが削除されていることを確認
    await expect(page.getByText('サンプルTODO')).not.toBeVisible();

    // TODOがない場合のメッセージが表示されることを確認
    await expect(page.getByText('TODOがありません')).toBeVisible();
  });
});
