import { api } from "@/lib/api";
import { lookupByZip } from "./address";
import type { ApiEnvelope, ZipLookupRes } from "@/api/types";
import { mapZipLookup } from "@/api/mappers";

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn()
  }
}));

jest.mock('@/api/mappers', () => ({
  mapZipLookup: jest.fn(),
}));

const mockedApi = api.get as jest.Mock;
const mockedMapResponse = mapZipLookup as jest.Mock;

describe('lookupByZip - succes and negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch address and map them correctly', async () => {
    const mockZip = '12910';
    const mockApiResponse: ApiEnvelope<ZipLookupRes[]> = {
      response_code: '200',
      response_message: 'Success',
      data: [{
        id: 25211,
        zip_code: "12910",
        subdistrict_id: 25201,
        subdistrict_name: "SETIABUDI",
        district_id: 1929,
        district_name: "SETIA BUDI",
        city_id: 155,
        city_name: "JAKARTA SELATAN",
        province_id: 11,
        province_name: "DKI JAKARTA",
        province_las_code: "DIJKT"
      }]
    };

    const mappedResponse = {
      id: 25211,
      zip_code: "12910",
      subdistrict_id: 25201,
      subdistrict_name: "SETIABUDI",
      district_id: 1929,
      district_name: "SETIA BUDI",
      city_id: 155,
      city_name: "JAKARTA SELATAN",
      province_id: 11,
      province_name: "DKI JAKARTA",
      province_las_code: "DIJKT"
    };

    mockedApi.mockResolvedValue({ data: mockApiResponse });
    mockedMapResponse.mockReturnValue(mappedResponse);

    const result = await lookupByZip(mockZip);

    expect(mockedApi).toHaveBeenCalledWith('/microsite/address-by-zip', { params: { q: mockZip } });
    expect(mockedMapResponse).toHaveBeenCalledWith(mockApiResponse.data[0]);
    expect(result).toEqual(mappedResponse);
  });

  it('should return default mapped object when API returns empty array', async () => {
    const mockZip = '00000';
    const mockData = {
      id: 0,
      zip_code: '',
      subdistrict_id: 0,
      subdistrict_name: '',
      district_id: 0,
      district_name: '',
      city_id: 0,
      city_name: '',
      province_id: 0,
      province_name: '',
      province_las_code: '',
    }

    mockedApi.mockResolvedValue({
      data: {
        response_code: '200',
        response_message: 'OK',
        data: []
      },
    });

    mockedMapResponse.mockReturnValue(mockData);

    const result = await lookupByZip(mockZip);
    expect(mockedApi).toHaveBeenCalledWith('/microsite/address-by-zip', { params: { q: mockZip } });
    expect(mockedMapResponse).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockData);
  });

  it('should throw error when API call fails', async () => {
    const mockZip = 'error';
    mockedApi.mockRejectedValue(new Error('Network Error'));

    await expect(lookupByZip(mockZip)).rejects.toThrow('Network Error');
    expect(mockedApi).toHaveBeenCalledWith('/microsite/address-by-zip', { params: { q: mockZip } });
    expect(mockedMapResponse).not.toHaveBeenCalled();
  });
});