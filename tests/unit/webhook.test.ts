import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addWebhook, removeWebhook, updateWebhook, getWebhooksByEvent, fireWebhooks, getAllWebhooks } from '../../app/src/services/webhookService';

describe('webhookService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('addWebhook', () => {
    it('adds a webhook and returns it with id and createdAt', async () => {
      const result = await addWebhook({
        name: 'Test Hook',
        url: 'https://example.com/hook',
        method: 'POST',
        events: ['message.created'],
        active: true,
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.name).toBe('Test Hook');
      expect(result.active).toBe(true);
    });

    it('stores the webhook persistently', async () => {
      await addWebhook({
        name: 'Persist Test', url: 'https://example.com/hook2', method: 'GET',
        events: ['agent.run.completed'], active: true,
      });
      const all = await getAllWebhooks();
      expect(all.length).toBeGreaterThanOrEqual(1);
      expect(all.some(w => w.name === 'Persist Test')).toBe(true);
    });
  });

  describe('removeWebhook', () => {
    it('removes an existing webhook', async () => {
      const added = await addWebhook({
        name: 'To Remove', url: 'https://example.com/remove', method: 'POST',
        events: ['test.event'], active: true,
      });
      await removeWebhook(added.id);
      const all = await getAllWebhooks();
      expect(all.find(w => w.id === added.id)).toBeUndefined();
    });

    it('does nothing for non-existent id', async () => {
      await removeWebhook('nonexistent');
      const all = await getAllWebhooks();
      expect(Array.isArray(all)).toBe(true);
    });
  });

  describe('updateWebhook', () => {
    it('updates webhook fields', async () => {
      const added = await addWebhook({
        name: 'Update Me', url: 'https://example.com/update', method: 'POST',
        events: ['original.event'], active: true,
      });
      const updated = await updateWebhook(added.id, { name: 'Updated Name', active: false });
      expect(updated).not.toBeNull();
      expect(updated!.name).toBe('Updated Name');
      expect(updated!.active).toBe(false);
    });

    it('returns null for non-existent webhook', async () => {
      const result = await updateWebhook('fake-id', { name: 'Noop' });
      expect(result).toBeNull();
    });
  });

  describe('getWebhooksByEvent', () => {
    it('returns only active webhooks matching the event', async () => {
      await addWebhook({
        name: 'Hook A', url: 'https://example.com/a', method: 'POST',
        events: ['event.x'], active: true,
      });
      await addWebhook({
        name: 'Hook B', url: 'https://example.com/b', method: 'POST',
        events: ['event.y'], active: true,
      });
      await addWebhook({
        name: 'Inactive Hook', url: 'https://example.com/inactive', method: 'POST',
        events: ['event.x'], active: false,
      });
      const matches = await getWebhooksByEvent('event.x');
      expect(matches).toHaveLength(1);
      expect(matches[0].name).toBe('Hook A');
    });

    it('returns empty array when no webhooks match', async () => {
      const matches = await getWebhooksByEvent('nonexistent.event');
      expect(matches).toEqual([]);
    });
  });

  describe('fireWebhooks', () => {
    it('fires POST webhooks with event payload', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true, status: 200,
      } as Response);

      await addWebhook({
        name: 'Fired Hook', url: 'https://example.com/fire', method: 'POST',
        events: ['test.fire'], active: true,
      });

      await fireWebhooks('test.fire', { message: 'hello' });

      expect(fetch).toHaveBeenCalledTimes(1);
      const callArgs = vi.mocked(fetch).mock.calls[0];
      expect(callArgs[0]).toBe('https://example.com/fire');
      const body = JSON.parse((callArgs[1] as any).body as string);
      expect(body.event).toBe('test.fire');
      expect(body.payload.message).toBe('hello');
    });

    it('fires GET webhooks without body', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true, status: 200,
      } as Response);

      await addWebhook({
        name: 'GET Hook', url: 'https://example.com/get', method: 'GET',
        events: ['test.get'], active: true,
      });

      await fireWebhooks('test.get', { data: 42 });

      const callArgs = vi.mocked(fetch).mock.calls[0];
      expect((callArgs[1] as any).body).toBeUndefined();
    });

    it('does not fire if no matching webhooks', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true, status: 200,
      } as Response);

      await fireWebhooks('unregistered.event', {});
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
