export const usePathname = () => "/Conv";
export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
});
export const redirect = jest.fn();
