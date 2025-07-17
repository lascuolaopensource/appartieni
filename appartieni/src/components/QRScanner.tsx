import { useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

interface Props {
  onScanned: (value: string) => void;
  onError: (err: any) => void;
}

export default function QRScannerView({ onScanned, onError }: Props) {
  useEffect(() => {
    (async () => {
      try {
        await BarcodeScanner.checkPermission({ force: true });
        document.body.classList.add('qr-active');
        await BarcodeScanner.hideBackground();   // transparent background
        const result = await BarcodeScanner.startScan(); // blocks until scan

        if (result.hasContent) {
          onScanned(result.content!);
        }
      } catch (err) {
        onError(err);
      } finally {
        BarcodeScanner.stopScan();
        BarcodeScanner.showBackground();
        document.body.classList.remove('qr-active');  // restore opaque bg
      }
    })();

    return () => {
      BarcodeScanner.stopScan();
      BarcodeScanner.showBackground();
      document.body.classList.remove('qr-active');
    };
  }, []);

  return <div id="qr-view" style={{ height: '100%' }} />;
}

