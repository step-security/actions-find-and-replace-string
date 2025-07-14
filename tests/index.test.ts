import * as core from '@actions/core';
import axios from 'axios';

// Mock the dependencies
jest.mock('@actions/core');
jest.mock('axios');

const mockedCore = core as jest.Mocked<typeof core>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Import the module after mocking
import { performFindReplace, getInputs, FindReplaceInputs } from '../src/index';

describe('Find and Replace Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variable
    process.env.GITHUB_REPOSITORY = 'test-org/test-repo';
    
    // Mock axios.get to succeed by default
    mockedAxios.get.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    delete process.env.GITHUB_REPOSITORY;
  });

  describe('performFindReplace function', () => {
    it('should replace first occurrence when replaceAll is false', () => {
      const inputs: FindReplaceInputs = {
        source: 'hello world hello',
        find: 'hello',
        replace: 'hi',
        replaceAll: false
      };

      const result = performFindReplace(inputs);
      expect(result).toBe('hi world hello');
    });

    it('should replace all occurrences when replaceAll is true', () => {
      const inputs: FindReplaceInputs = {
        source: 'hello world hello',
        find: 'hello',
        replace: 'hi',
        replaceAll: true
      };

      const result = performFindReplace(inputs);
      expect(result).toBe('hi world hi');
    });

    it('should handle empty replacement string', () => {
      const inputs: FindReplaceInputs = {
        source: 'refs/heads/main',
        find: 'refs/heads/',
        replace: '',
        replaceAll: false
      };

      const result = performFindReplace(inputs);
      expect(result).toBe('main');
    });
  });

  describe('getInputs function', () => {    
    it('should default replaceAll to false when not specified', () => {
      mockedCore.getInput.mockImplementation((name: string) => {
        switch (name) {
          case 'source': return 'hello world';
          case 'find': return 'hello';
          case 'replace': return 'hi';
          case 'replaceAll': return '';
          default: return '';
        }
      });

      const inputs = getInputs();
      expect(inputs).toEqual({
        source: 'hello world',
        find: 'hello',
        replace: 'hi',
        replaceAll: false
      });
    });
  });
});