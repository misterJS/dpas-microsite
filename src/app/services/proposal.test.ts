import { api } from "@/lib/api";
import {
  checkAvailability,
  createSPAJ,
  submissionProposal,
  getProposalStatus
} from "./proposal";
import type {
  ApiEnvelope,
  CheckAvailabilityReq,
  CheckAvailabilityRes,
  CreateSPAJRes,
  SubmissionReq,
} from "@/api/types";
import {
  mapCreateSpajResponse,
  mapProposalStatus,
  mapUnknownData,
} from "@/api/mappers";

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

jest.mock('@/api/mappers', () => ({
  mapCreateSpajResponse: jest.fn(),
  mapUnknownData: jest.fn(),
  mapProposalStatus: jest.fn()
}))

//check availability
const mockedApiCheckAvailability = api.post as jest.Mock;
describe('checkAvailability - success case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call CheckAvailability and map them correctly', async () => {
    const body: CheckAvailabilityReq = {
      birth_date: "19901107",
      component_code: "T4A1",
      email: "pipizeek@gmail.com",
      ktp_id: "1871139784678881",
      marital_status: "M",
      product_code: "T4A"
    }

    const mockResponse: { data: ApiEnvelope<CheckAvailabilityRes> } = {
      data: {
        response_code: "200",
        response_message: "OK",
        data: {
          status: {
            code: "",
            message: "",
            errors: []
          },
          body: {
            product_code: "T4C",
            component_code: "T4C1",
            birth_date: "19901231",
            email: "reyhan@prudentialsyariah.co.id",
            ktp_id: "3375819475857111",
            marital_status: "S"
          },
          decisions: "Y",
          decision_description: "Client has no existing digital product PLS.",
          validations: {
            max_allowed_policies_per_life_assured_check: "1",
            max_allowed_policies_per_email_identifier: "1"
          }
        }
      }
    }

    mockedApiCheckAvailability.mockResolvedValue(mockResponse);
    const result = await checkAvailability(body);
    expect(mockedApiCheckAvailability).toHaveBeenCalledWith('/check-availability', body);
    expect(result).toEqual(mockResponse.data.data);
  })
});

describe('checkAvailability - negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  const body: CheckAvailabilityReq = {
    birth_date: "19901107",
    component_code: "T4A1",
    email: "pipizeek@gmail.com",
    ktp_id: "1871139784678881",
    marital_status: "M",
    product_code: "T4A"
  }

  it('should throw error when API call fails', async () => {
    (mockedApiCheckAvailability).mockRejectedValue(new Error('Network Error'));
    await expect(checkAvailability(body)).rejects.toEqual('Terjadi kesalahan');
    expect(mockedApiCheckAvailability).toHaveBeenCalledWith('/check-availability', body);
  });
});

// create SPAJ
const mockedApiGetSPAJ = api.get as jest.Mock;
const mockedMapCreateSpajResponse = mapCreateSpajResponse as jest.Mock;

describe('createSPAJ - success case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call SPAJ and map them correctly', async () => {

    const mockData = {
      id: '0ff371fd-13b1-4459-a881-d563416dc763',
      spaj_number: 'DG00001637',
    }

    const mockResponse: { data: ApiEnvelope<CreateSPAJRes> } = {
      data: {
        response_code: '200',
        response_message: 'Success',
        data: mockData
      },
    };

    mockedApiGetSPAJ.mockResolvedValue(mockResponse);
    mockedMapCreateSpajResponse.mockReturnValue(mockData);

    const result = await createSPAJ();
    expect(mockedApiGetSPAJ).toHaveBeenCalledWith('/proposal/create-spaj');
    expect(mockedMapCreateSpajResponse).toHaveBeenCalledWith(mockResponse.data.data);
    expect(result).toEqual(mockData);
  });
});


describe('createSPAJ - negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when API call fails', async () => {
    mockedApiGetSPAJ.mockRejectedValue(new Error('Network Error'));
    await expect(createSPAJ()).rejects.toThrow('Network Error');
    expect(mockedApiGetSPAJ).toHaveBeenCalledWith('/proposal/create-spaj');
  });

  it('should return default mapped object when API returns null data', async () => {
    const mockResponse = {
      data: {
        response_code: '200',
        response_message: 'Success',
        data: null,
      },
    };

    mockedApiGetSPAJ.mockResolvedValue(mockResponse);
    mockedMapCreateSpajResponse.mockReturnValue({
      id: '',
      spaj_number: '',
    });

    const result = await createSPAJ();
    expect(mockedApiGetSPAJ).toHaveBeenCalledWith('/proposal/create-spaj');
    expect(mockedMapCreateSpajResponse).toHaveBeenCalledWith(null);
    expect(result).toEqual({ id: '', spaj_number: '' });
  });
});

// submit proposal
const mockedApiPostSubmit = api.post as jest.Mock;
const mockedMapUnknownData = mapUnknownData as jest.Mock;
const body: SubmissionReq = {
  spaj_number: 'SPAJ123',
  product: {
    product_id: 'P001',
    product_code: 'PRD001',
    product_name: 'Product Name',
    package: {
      package_id: 'PKG01',
      package_name: 'Package Name',
      package_code: 'PKGCODE',
      premium_amount: 100000,
      term: {
        term_id: 'TERM01',
        term: 12,
        term_unit: 'MONTH',
      },
      benefits: [],
    },
  },
  client: {
    branch: 'Jakarta',
    nik: '1234567890',
    full_name: 'John Doe',
    pob: 'Jakarta',
    dob: '1990-01-01',
    marital_status: 'M',
    sex: 'M',
    email: 'john@example.com',
    address: 'Jl. Sudirman',
    phone: '08123456789',
    country_code: '+62',
    zip_code: '12345',
    province_id: 'ID01',
    city_id: 'CITY01',
    district_id: 'DIST01',
    subdistrict_id: 'SUBDIST01',
    province: 'DKI Jakarta',
    city_name: 'Jakarta',
    district_name: 'Sudirman',
    subdistrict_name: 'Kebayoran',
    job: 'Engineer',
    income_code: 'INC01',
    income: '10000000',
    benef_name: 'Jane Doe',
    benef_phone: '08123456780',
    benef_country_code: '+62',
    benef_address: 'Jl. Thamrin',
    relation: 'Spouse',
  },
  questionaire: {
    consent: [],
    health_questionnaire: []
  },
};
describe('submissionProposal - success case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call API submit and return submission response', async () => {
    const mockResponse: { data: ApiEnvelope<Record<string, unknown>> } = {
      data: {
        response_code: '200',
        response_message: 'OK',
        data: {
          success: true
        },
      },
    };

    mockedApiPostSubmit.mockResolvedValue(mockResponse);
    mockedMapUnknownData.mockReturnValue({ success: true });

    const result = await submissionProposal(body);
    expect(mockedApiPostSubmit).toHaveBeenCalledWith('/proposal/submit', body);
    expect(mockedMapUnknownData).toHaveBeenCalledWith(mockResponse.data.data, {});
    expect(result).toEqual({ success: true });
  });
});

describe('submissionProposal - negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject with validation error when request body is invalid', async () => {
    const invalidBody = {} as SubmissionReq;
    const mockError = {
      response: {
        status: 400,
        data: {
          data: 'Invalid request body',
        },
      },
    };

    mockedApiPostSubmit.mockRejectedValue(mockError);
    await expect(submissionProposal(invalidBody)).rejects.toMatchObject({ response: { data: { data: 'Invalid request body' } } });
    expect(mockedApiPostSubmit).toHaveBeenCalledWith('/proposal/submit', invalidBody);
  });

  it('should reject with server error when API returns 500', async () => {
    const body = {} as SubmissionReq;
    const mockError = {
      response: {
        status: 500,
        data: { data: 'Internal Server Error' },
      },
    };
    mockedApiPostSubmit.mockRejectedValue(mockError);
    await expect(submissionProposal(body)).rejects.toEqual(mockError);
  });

  it('should throw error when API call fails', async () => {
    mockedApiPostSubmit.mockRejectedValue(new Error('Network Error'));
    await expect(submissionProposal(body)).rejects.toThrow('Network Error');
    expect(mockedApiPostSubmit).toHaveBeenCalledWith('/proposal/submit', body);
  });
});

// status
const mockedApiGet = api.get as jest.Mock;
const mockedMapProposalStatus = mapProposalStatus as jest.Mock;
describe('getProposalStatus - success case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call API status and return mapped status', async () => {
    const spajNumber = 'DG00001637';
    const mockResponse: { data: ApiEnvelope<{ status: string }> } = {
      data: {
        response_code: '200',
        response_message: 'OK',
        data: { status: 'CLEAN' },
      },
    };

    mockedApiGet.mockResolvedValue(mockResponse);
    mockedMapProposalStatus.mockReturnValue({
      success: true,
      inforce: false,
      failed: false,
    });

    const result = await getProposalStatus(spajNumber);
    expect(mockedApiGet).toHaveBeenCalledWith(`/proposal/${spajNumber}/status`);
    expect(mockedMapProposalStatus).toHaveBeenCalledWith(mockResponse.data.data);
    expect(result).toEqual({
      success: true,
      inforce: false,
      failed: false,
    });
  });
});

describe('getProposalStatus - negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when API call fails', async () => {
    const spajNumber = 'DG00001637';
    mockedApiGet.mockRejectedValue(new Error('Network Error'));
    await expect(getProposalStatus(spajNumber)).rejects.toThrow('Network Error');
    expect(mockedApiGet).toHaveBeenCalledWith(`/proposal/${spajNumber}/status`);
  });
});



