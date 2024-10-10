import { isFutureDate } from './helpers';

// Change the test date to something in the future
test('Next year is a Future date = true', () => {
    expect(isFutureDate('12.12.2025', Date.now())).toBe(true); // Use a future date
});
