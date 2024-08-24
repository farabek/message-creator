///////////////////////////////////////////////////////
// ProcessText.test.ts

import { processText } from './ProcessText';

describe('processText', () => {
  const testData = {
    '1': {
      text: 'Привет ',
      after: 5,
      if: 2,
      then: 3,
      else: 4,
    },
    '2': {
      text: '{firstname}',
      if: null,
      after: null,
      else: null,
      then: null,
    },
    '3': {
      text: '{firstname}',
      after: null,
      else: null,
      if: null,
      then: null,
    },
    '4': {
      text: 'Максим',
      after: null,
      else: null,
      if: null,
      then: null,
    },
    '5': {
      text: '! Как дела в ',
      after: 9,
      if: 6,
      then: 7,
      else: 8,
    },
    '6': {
      text: '{company}',
      after: null,
      else: null,
      if: null,
      then: null,
    },
    '7': {
      text: '{company}',
      after: null,
      else: null,
      if: null,
      then: null,
    },
    '8': {
      text: 'твоей компании',
      after: null,
      else: null,
      if: null,
      then: null,
    },
    '9': {
      text: '!',
      after: null,
      else: null,
      if: null,
      then: null,
    },
  };
  const objectVar = { firstname: 'John', company: 'Doe' };
  const objectVarEmpty = { firstname: '', company: '' };
  const objectVarWithRegExp = { firstname: '[a-zA-Z0-9]{20}', company: '[a-z0-9!@#$%^&*()_+]{20}' };
  const arrVarNames = ['firstname', 'company'];

  it('should return concatenated text when given valid data and start key', () => {
    const result = processText(testData, 1, arrVarNames, testData, objectVar);
    expect(result).toEqual('Привет John! Как дела в Doe!');
  });

  it('should return concatenated text when given empty data and start key', () => {
    const result = processText(testData, 1, arrVarNames, testData, objectVarEmpty);
    expect(result).toEqual('Привет Максим! Как дела в твоей компании!');
  });

  it('should return concatenated text when given data with regExp and start key', () => {
    const result = processText(testData, 1, arrVarNames, testData, objectVarWithRegExp);
    expect(result).toEqual('Привет [a-zA-Z0-9]{20}! Как дела в [a-z0-9!@#$%^&*()_+]{20}!');
  });

  it('should return concatenated text when given data with index "after"', () => {
    const result = processText(testData, 5, arrVarNames, testData, objectVar);
    expect(result).toEqual('! Как дела в Doe!');
  });
});
