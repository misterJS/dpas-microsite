import { api } from "@/lib/api";
import { generateRipleyPDF } from './document';
import type { ApiEnvelope, DocumentReq, DocumentRes } from "@/api/types";
import { mapDocumentResponse } from "@/api/mappers";

jest.mock('@/lib/api', () => ({
  api: {
    post: jest.fn()
  }
}));

jest.mock('@/api/mappers', () => ({
  mapDocumentResponse: jest.fn(),
}));

const mockedApiPost = api.post as jest.Mock;
const mockedMapDocumentResponse = mapDocumentResponse as jest.Mock;

const slug = 'UOB';
const productCode = 'T4A';
const body: DocumentReq = {
  full_name: "Test Buat",
  dob: "1997-11-05",
  pob: "bandung",
  sex: "MEN",
  benef_name: "Test Buat",
  email: "pipizeek@gmail.com",
  package_code: "T4A1",
  product_code: "T4A",
  term: 12,
  term_unit: "M"
};


describe('generateRipleyPDF - success case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call API and return mapped document', async () => {
    const mockData = {
      doc_id: '000001',
      fileBase64: 'BASE64STRING',
    }

    const mockResponse: { data: ApiEnvelope<DocumentRes> } = {
      data: {
        response_code: '200',
        response_message: 'OK',
        data: mockData
      },
    };

    mockedApiPost.mockResolvedValue(mockResponse);
    mockedMapDocumentResponse.mockReturnValue(mockData);

    const result = await generateRipleyPDF(slug, productCode, body);
    expect(mockedApiPost).toHaveBeenCalledWith(
      `/microsite/${slug}/products/${productCode}/generate-riplay`,
      body
    );
    expect(mockedMapDocumentResponse).toHaveBeenCalledWith(mockResponse.data.data);
    expect(result).toEqual(mockData);
  });
});

describe('generateRipleyPDF - negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when API call fails', async () => {
    mockedApiPost.mockRejectedValue(new Error('Network Error'));
    await expect(generateRipleyPDF(slug, productCode, body)).rejects.toThrow('Network Error');
    expect(mockedApiPost).toHaveBeenCalledWith(
      `/microsite/${slug}/products/${productCode}/generate-riplay`,
      body
    );
  });

  it('should return default mapped object when API returns null data', async () => {
    const mockResponse = {
      data: {
        response_code: '200',
        response_message: 'OK',
        data: null,
      },
    };

    mockedApiPost.mockResolvedValue(mockResponse);
    mockedMapDocumentResponse.mockReturnValue({ doc_id: '', fileBase64: '', });

    const result = await generateRipleyPDF(slug, productCode, body);
    expect(mockedApiPost).toHaveBeenCalledWith(
      `/microsite/${slug}/products/${productCode}/generate-riplay`,
      body
    );
    expect(mockedMapDocumentResponse).toHaveBeenCalledWith(null);
    expect(result).toEqual({ doc_id: '', fileBase64: '' });
  });

  it('should throw error when API response structure is invalid', async () => {
    mockedApiPost.mockResolvedValue({});
    await expect(generateRipleyPDF(slug, productCode, body)).rejects.toThrow();
  });

});