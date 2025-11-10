import { api } from "@/lib/api";
import { getBranches } from './options';
import type { ApiEnvelope, BranchItem } from "@/api/types";
import {
  mapBranchOptions,
  type Option,
} from "@/api/mappers";

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn()
  }
}));
jest.mock('@/api/mappers', () => ({
  mapBranchOptions: jest.fn(),
}));

const mockedApi = api.get as jest.Mock;
const mockedMapBranchResponse = mapBranchOptions as jest.Mock;

describe('getBranches', () => {
  const mockSlug = 'uob';
  const mockBranches: BranchItem[] = [
    {
      branch_id: 'fd35f62f-0974-45c8-8b18-a52f0724b568',
      desc_item: 'BBUOB',
      short_desc: 'BBUOB',
      long_desc: 'BBUOB',
    },
    {
      branch_id: '1f2ed4c4-0e1e-4f02-85fe-31d591015e6e',
      desc_item: 'B001B',
      short_desc: 'UOBB',
      long_desc: 'UOB - BB GAJAH MADA',
    },
  ];
  const mockApiResponse: ApiEnvelope<BranchItem[]> = {
    response_code: '200',
    response_message: 'OK',
    data: mockBranches,
  };

  const mappedOptions: Option[] = [
    { code: 'fd35f62f-0974-45c8-8b18-a52f0724b568', name: 'BBUOB' },
    { code: '1f2ed4c4-0e1e-4f02-85fe-31d591015e6e', name: 'UOB - BB GAJAH MADA' },
  ];

  it('should fetch branches and map them correctly', async () => {
    mockedApi.mockResolvedValue({ data: mockApiResponse });
    mockedMapBranchResponse.mockReturnValue(mappedOptions);

    const result = await getBranches(mockSlug);

    expect(mockedApi).toHaveBeenCalledWith(`/microsite/${mockSlug}/bank-branches`);
    expect(mockedMapBranchResponse).toHaveBeenCalledWith(mockBranches);
    expect(result).toEqual(mappedOptions);
  });

  it('should return empty array when API returns null data', async () => {
    const nullApiResponse: ApiEnvelope<BranchItem[] | null> = {
      response_code: '200',
      response_message: 'OK',
      data: null,
    };

    mockedApi.mockResolvedValue({ data: nullApiResponse });
    mockedMapBranchResponse.mockReturnValue([]);

    const result = await getBranches(mockSlug);

    expect(mockedApi).toHaveBeenCalledWith(`/microsite/${mockSlug}/bank-branches`);
    expect(mockedMapBranchResponse).toHaveBeenCalledWith(null);
    expect(result).toEqual([]);
  });

  it('should throw error when API call fails', async () => {
    mockedApi.mockRejectedValue(new Error('Network Error'));
    await expect(getBranches(mockSlug)).rejects.toThrow('Network Error');
    expect(mockedApi).toHaveBeenCalledWith(`/microsite/${mockSlug}/bank-branches`);
  });

  it('should use default slug when none is provided', async () => {
    mockedApi.mockResolvedValue({ data: mockApiResponse });
    mockedMapBranchResponse.mockReturnValue(mappedOptions);

    const result = await getBranches();
    expect(mockedApi).toHaveBeenCalledWith(`/microsite/uob/bank-branches`);
    expect(mockedMapBranchResponse).toHaveBeenCalledWith(mockBranches);
    expect(result).toEqual(mappedOptions);
  });
});