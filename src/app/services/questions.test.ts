import { getQuestions } from './questions';
import { api } from '@/lib/api';
import type { HealthQuestion, ApiEnvelope } from '@/api/types';
import {
  mapHealthQuestionGroups,
  type QuestionGroup,
} from "@/api/mappers";

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn()
  }
}));
jest.mock('@/api/mappers', () => ({
  mapHealthQuestionGroups: jest.fn(),
}));

const mockedApiGet = api.get as jest.Mock;
const mockedMapper = mapHealthQuestionGroups as jest.Mock;

describe('getQuestions - success case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch questions and map them correctly', async () => {
    const mockHealthQuestions: HealthQuestion[] = [
      {
        answer_type: 'YES_NO',
        code: 'EX1',
        group_label: 'Pengecualian',
        group_order: 1,
        group_type: 'EXCLUSION',
        id: 'e2909ed5-7a19-479b-82ba-5b760edcad22',
        no_label: 'Tidak, Saya belum membaca dan memahami.',
        question_order: 1,
        question_text: 'Pengelola tidak akan membayarkan klaim Manfaat',
        yes_label: 'Ya, Saya telah membaca dan memahami.',
        type: 'CONSENT',
      },
    ];

    const mockMappedGroups: QuestionGroup[] = [
      {
        group_order: 1,
        group_type: 'EXCLUSION',
        group_label: 'Pengecualian',
        question: [mockHealthQuestions[0]],
      },
    ];

    mockedApiGet.mockResolvedValue({
      data: { data: mockHealthQuestions } as ApiEnvelope<HealthQuestion[]>,
    });

    mockedMapper.mockReturnValue(mockMappedGroups);

    const slug = 'UOB';
    const product_code = 'T4A';
    const type = 'CONSENT';

    const result = await getQuestions(slug, product_code, type);

    expect(mockedApiGet).toHaveBeenCalledWith(
      `/microsite/${slug}/products/${product_code}/question`,
      { params: { type } }
    );

    expect(mockedMapper).toHaveBeenCalledWith(mockHealthQuestions);
    expect(result).toEqual(mockMappedGroups);
  });
});

describe('getQuestions - negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when API returns undefined data', async () => {
    mockedApiGet.mockResolvedValue({
      data: { data: undefined },
    });

    mockedMapper.mockReturnValue([]);

    const result = await getQuestions('UOB', 'T4A', 'CONSENT');

    expect(mockedApiGet).toHaveBeenCalled();
    expect(mockedMapper).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([]);
  });

  it('should return empty array when API returns null data', async () => {
    mockedApiGet.mockResolvedValue({
      data: { data: null },
    });

    mockedMapper.mockReturnValue([]);

    const result = await getQuestions('UOB', 'T4A', 'CONSENT');

    expect(mockedApiGet).toHaveBeenCalled();
    expect(mockedMapper).toHaveBeenCalledWith(null);
    expect(result).toEqual([]);
  });

  it('should throw error when API call fails', async () => {
    mockedApiGet.mockRejectedValue(new Error('Network error'));

    await expect(getQuestions('UOB', 'T4A', 'CONSENT')).rejects.toThrow('Network error');
    expect(mockedApiGet).toHaveBeenCalled();
  });
});
