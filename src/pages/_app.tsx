import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from "../../componets/customer/helpers/CartContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
