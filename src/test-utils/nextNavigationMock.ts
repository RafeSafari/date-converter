export const usePathname = () => "/Conv";

const router = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
};

export const useRouter = () => router;
export const redirect = jest.fn();
