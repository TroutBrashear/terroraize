import { describe, it, expect } from 'vitest';

import { sanitizeAIJSON } from '../src/services/ai'; // Adjust the path as needed

// 2. Create a suite of tests for this function.
describe('Director Test', () => {

  // 3. Test the "happy path" - a perfect JSON string.
  it('should return a valid JSON string as is', () => {
    const input = '[{"id": 1}]';
    expect(sanitizeAIJSON(input)).toBe('[{"id": 1}]');
  });

  // 4. Test for extraneous text before the JSON.
  it('should trim text before the first bracket or brace', () => {
    const input = 'Here is the JSON you requested: [{"id": 1}]';
    expect(sanitizeAIJSON(input)).toBe('[{"id": 1}]');
  });

  // 5. Test for extraneous text after the JSON.
  it('should trim text after the last bracket or brace', () => {
    const input = '[{"id": 1}] I hope this helps!';
    expect(sanitizeAIJSON(input)).toBe('[{"id": 1}]');
  });

  // 6. Test for both before and after.
  it('should extract JSON when surrounded by text', () => {
    const input = 'Sure! [{"id": 1}] Let me know if you need more.';
    expect(sanitizeAIJSON(input)).toBe('[{"id": 1}]');
  });

  // 7. Test edge cases.
  it('should return null if no JSON is found', () => {
    const input = 'There is no JSON here.';
    expect(sanitizeAIJSON(input)).toBeNull();
  });

  it('should return null for an incomplete JSON string', () => {
    const input = '[{"id": 1}'; // Missing closing bracket
    expect(sanitizeAIJSON(input)).toBeNull();
  });
  
});