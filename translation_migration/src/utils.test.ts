import { flatObject, chunk } from './utils';

describe("utils", () => {
  describe("flatObject()", () => {
    test("have all object keys flatted", () => {
      const flatted = flatObject({
        a: {
          b: 1,
          c: {
            d: 2,
            e: {
              f: 3,
            }
          }
        }
      });
      expect(flatted).toEqual({
        _a_b: 1,
        _a_c_d: 2,
        _a_c_e_f: 3,
      });
    });
  });

  describe("chunk()", () => {
    test("have the array chunked in smaller arrays", () => {
      // case: empty array
      expect(chunk([], 5)).toEqual([]);

      // case: array with one element
      expect(chunk([1], 2)).toEqual([
        [1],
      ]);
      
      // case: array with multiple elements
      expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([
        [1, 2, 3],
        [4, 5],
      ]);
    });
  });
});
