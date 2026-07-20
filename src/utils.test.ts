import { describe, it, expect, vi } from 'vitest';
import { getItemText, sortLocationKeys, loadExistingLocationKeys } from './utils';
import { ID } from './main';

// Mock OBR SDK so imports from main don't crash
vi.mock('@owlbear-rodeo/sdk', () => ({
  default: {
    isAvailable: true,
    scene: {
      isReady: vi.fn().mockResolvedValue(true),
    },
  },
}));

describe('utils', () => {
  describe('getItemText', () => {
    it('returns empty string if no text', () => {
      expect(getItemText({})).toBe('');
    });

    it('extracts plainText if richText is missing', () => {
      expect(getItemText({ text: { plainText: 'Hello' } })).toBe('Hello');
    });

    it('extracts and spaces out richText children (Issue #15)', () => {
      const item = {
        text: {
          richText: [
            { children: [{ text: 'Location Name' }] },
            { children: [{ text: 'Second Line' }] }
          ]
        }
      };
      expect(getItemText(item)).toBe('Location Name Second Line');
    });
  });

  describe('sortLocationKeys', () => {
    it('sorts alphabetically establishing current lexicographical baseline (Issue #23)', () => {
      const keys: any[] = [
        { name: '10', id: '1', description: '' },
        { name: '2', id: '2', description: '' },
        { name: '1', id: '3', description: '' }
      ];
      sortLocationKeys(keys);
      // With lexicographical sort: 1, 10, 2
      expect(keys[0].name).toBe('1');
      expect(keys[1].name).toBe('10');
      expect(keys[2].name).toBe('2');
    });
  });

  describe('loadExistingLocationKeys', () => {
    it('extracts location key metadata correctly (Issues #9, #24, #28)', () => {
      const items = [
        {
          id: 'item1',
          position: { x: 0, y: 0 },
          visible: true,
          metadata: {
            [`${ID}/metadata`]: {
              locationKey: 'GM notes',
              playerInfo: 'Player notes',
              isPlayerVisible: true,
              isPlayerEditable: false
            }
          },
          text: { plainText: 'Room 1' }
        }
      ];
      
      const newKeys: any[] = [];
      const getItemTextMock = (i: any) => i.text.plainText;
      
      loadExistingLocationKeys(items as any, newKeys, getItemTextMock);
      
      expect(newKeys.length).toBe(1);
      expect(newKeys[0].name).toBe('Room 1');
      expect(newKeys[0].description).toBe('GM notes');
      expect(newKeys[0].playerInfo).toBe('Player notes');
      expect(newKeys[0].isPlayerVisible).toBe(true);
      expect(newKeys[0].isPlayerEditable).toBe(false);
    });

    it('falls back to defaults if metadata fields are missing', () => {
      const items = [
        {
          id: 'item1',
          position: { x: 0, y: 0 },
          visible: true,
          metadata: {
            [`${ID}/metadata`]: {
              locationKey: 'GM notes only'
            }
          },
          text: { plainText: 'Room 2' }
        }
      ];
      
      const newKeys: any[] = [];
      const getItemTextMock = (i: any) => i.text.plainText;
      
      loadExistingLocationKeys(items as any, newKeys, getItemTextMock);
      
      expect(newKeys.length).toBe(1);
      expect(newKeys[0].playerInfo).toBe('');
      expect(newKeys[0].isPlayerVisible).toBe(false);
      expect(newKeys[0].isPlayerEditable).toBe(true);
    });
  });
});
