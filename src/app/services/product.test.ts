import { api } from "@/lib/api";
import { getProducts, getProductDetail, computePremium } from "./product";
import {
  mapProductList,
  mapProductDetail,
  mapComputePremium
} from "@/api/mappers";
import type {
  ApiEnvelope,
  ProductListItem,
  ProductDetail,
  ComputePremiumReq,
  ComputePremiumRes
} from "@/api/types";

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  },
}));
jest.mock('@/api/mappers', () => ({
  mapProductList: jest.fn(),
  mapProductDetail: jest.fn(),
  mapComputePremium: jest.fn()
}))

const mockedGetApiProduct = api.get as jest.Mock;
const mockedProductList = mapProductList as jest.Mock;

describe('getProducts - success case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products list and map them correctly', async () => {
    const mockResponse: ProductListItem[] = [
      {
        product_id: "85b27b3a-1437-44c6-a974-04205db44b36",
        product_name: "Kecelakaan",
        microsite_id: "ab41e1c9-77e5-43d1-ab64-bd2912dc0256",
        product_code: "T4A",
        image: "AP1.jpg",
        desc: "Perlindungan Manfaat Meninggal Dunia Akibat Kecelakaan, "
      },
      {
        product_id: "113c3268-9180-443c-9479-f6ba3d5f9a2e",
        product_name: "Cacat total akibat kecelakaan",
        microsite_id: "ab41e1c9-77e5-43d1-ab64-bd2912dc0256",
        product_code: "T4B",
        image: "AP1.jpg",
        desc: "Perlindungan yang mengutamakan Manfaat Cacat Total Akibat Kecelakaan"
      }
    ]

    mockedGetApiProduct.mockResolvedValue({
      data: { data: mockResponse } as ApiEnvelope<ProductListItem[]>
    });
    mockedProductList.mockReturnValue(mockResponse);

    const result = await getProducts('UOB', { search: 'Product' });

    expect(mockedGetApiProduct).toHaveBeenCalledWith('/microsite/UOB/products', {
      params: { search: 'Product' }
    });
    expect(mockedProductList).toHaveBeenCalledWith(mockResponse);
    expect(result).toEqual(mockResponse);
  })
});

describe('getProduct - negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when API calls fails', async () => {
    mockedGetApiProduct.mockRejectedValue(new Error('Network Error'));
    await expect(getProducts('UOB')).rejects.toThrow('Network Error');
    expect(mockedGetApiProduct).toHaveBeenCalledWith('/microsite/UOB/products', {
      params: undefined
    });
  })

  it('should return empty array when data is null', async () => {
    const mockResponse = {
      data: {
        response_code: '200',
        response_message: 'Success',
        data: null,
      },
    };

    (mockedGetApiProduct).mockResolvedValue(mockResponse);
    (mockedProductList).mockReturnValue([]);
    const result = await getProducts('UOB');
    expect(result).toEqual([]);
  });
});

//Product Detail
const mockedGetApiProductDetail = api.get as jest.Mock;
const mockedProductDetail = mapProductDetail as jest.Mock;

describe("getProductDetail - success case", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should should fetch product detail and map them correctly", async () => {
    const mockData: ProductDetail = {
      product_id: "85b27b3a-1437-44c6-a974-04205db44b36",
      product_code: "T4A",
      product_name: "PruLindungi Syariah - Accident",
      desc: "Description",
      terms: [{
        term_id: "f956a0e6-0fb8-40e5-8ba6-cbfb4440ad9a",
        term: 6,
        term_unit: "M"
      }],
      packages: [
        {
          package_id: "db7047d6-ea21-4777-9940-73dc363e66d7",
          package_name: "SILVER",
          package_code: "T4A1",
          benefits: [
            {
              benef_code: "GG",
              benef_name: "Gigi",
              benef_amount: 50,
              benef_type: "MAIN",
              notes: "Gigi"
            }]
        }]
    };

    const mockResponse: { data: ApiEnvelope<ProductDetail> } = {
      data: {
        response_code: "200",
        response_message: "OK",
        data: mockData
      }
    };

    mockedGetApiProductDetail.mockResolvedValue(mockResponse);
    mockedProductDetail.mockReturnValue(mockData);

    const result = await getProductDetail("UOB", "T4A");
    expect(mockedGetApiProductDetail).toHaveBeenCalledWith("/microsite/UOB/products/T4A");
    expect(mockedProductDetail).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockData);
  });
});

describe("getProductDetail - negative case", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return undefined when API returns null data", async () => {
    const mockResponse: { data: ApiEnvelope<ProductDetail | null> } = {
      data: {
        response_code: "200",
        response_message: "OK",
        data: null
      }
    };

    mockedGetApiProductDetail.mockResolvedValue(mockResponse);
    mockedProductDetail.mockReturnValue(undefined);

    const result = await getProductDetail("UOB", "T4A");
    expect(mockedGetApiProductDetail).toHaveBeenCalled();
    expect(mockedProductDetail).toHaveBeenCalledWith(null);
    expect(result).toBeUndefined();
  });

  it("should throw error when API fails", async () => {
    mockedGetApiProductDetail.mockRejectedValue(new Error("Network Error"));
    await expect(getProductDetail("UOB", "T4A")).rejects.toThrow("Network Error");
  });
});

// Compute premium
const mockedPostCompute = api.post as jest.Mock;
const mockedCompute = mapComputePremium as jest.Mock;
const body: ComputePremiumReq = {
  package_id: "db7047d6-ea21-4777-9940-73dc363e66d7",
  policy_term_id: "28a1122e-c493-4355-9e03-e986ef93e7bf",
  product_code: "T4A"
};


describe('computePremium - success case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch compute premium and map them correctly', async () => {
    const mockData: ComputePremiumRes = {
      premium_amount: 100000,
      ujroh_amount: 5000,
      tabaru_amount: 2000,
    }
    const mockResponse = {
      data: {
        response_code: '200',
        response_message: 'OK',
        data: mockData
      },
    };

    (mockedPostCompute).mockResolvedValue(mockResponse);
    (mockedCompute as jest.Mock).mockReturnValue(mockData);

    const result = await computePremium('UOB', body);
    expect(mockedPostCompute).toHaveBeenCalledWith('/microsite/UOB/compute-premium', body);
    expect(mockedCompute).toHaveBeenCalledWith(mockResponse.data.data);
    expect(result).toEqual(mockData);
  });
});

describe('computePremium - negative case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when API call fails', async () => {
    (mockedPostCompute as jest.Mock).mockRejectedValue(new Error('Network Error'));
    await expect(computePremium('UOB', body)).rejects.toThrow('Network Error');
    expect(mockedPostCompute).toHaveBeenCalledWith('/microsite/UOB/compute-premium', body);
  });

  it('should return default mapped object when data.data is null', async () => {
    const mockData: ComputePremiumRes = {
      premium_amount: 0,
      ujroh_amount: 0,
      tabaru_amount: 0,
    }

    const mockResponse = {
      data: {
        response_code: '200',
        response_message: 'OK',
        data: null,
      },
    };

    (mockedPostCompute as jest.Mock).mockResolvedValue(mockResponse);
    (mapComputePremium as jest.Mock).mockReturnValue(mockData);
    const result = await computePremium('slug-example', body);
    expect(result).toEqual(mockData);
  });

});



