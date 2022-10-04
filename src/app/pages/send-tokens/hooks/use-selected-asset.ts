import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { getTicker, initBigNumber } from '@app/common/utils';
import { ftDecimals, stacksValue } from '@app/common/stacks-utils';
import { useSelectedAssetMetadata } from '@app/store/assets/asset.hooks';
import { useCurrentAccountAvailableStxBalance } from '@app/query/stacks/balance/balance.hooks';

export function useSelectedAsset(assetId: string) {
  const selectedAsset = useSelectedAssetMetadata(assetId);
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  const name = selectedAsset?.meta?.name || selectedAsset?.name;
  const isStx = selectedAsset?.name === 'Stacks Token';
  const ticker = selectedAsset
    ? isStx
      ? 'STX'
      : selectedAsset?.meta?.symbol || getTicker(selectedAsset.name)
    : null;

  const balance = useMemo<string | undefined>(() => {
    if (!selectedAsset) return;
    if (selectedAsset.type === 'stx')
      return stacksValue({ value: availableStxBalance || 0, withTicker: false });
    if (selectedAsset?.meta?.decimals)
      return ftDecimals(selectedAsset.balance, selectedAsset.meta?.decimals);
    return new BigNumber(selectedAsset.balance).toFormat();
  }, [selectedAsset, availableStxBalance]);

  const hasDecimals = isStx || (selectedAsset?.meta?.decimals && selectedAsset?.meta?.decimals > 0);
  const placeholder = selectedAsset
    ? `0${
        hasDecimals ? `.${'0'.repeat(isStx ? 6 : selectedAsset.meta?.decimals || 0)}` : ''
      } ${ticker}`
    : '';

  return {
    balance,
    balanceBigNumber: balance ? initBigNumber(balance.replace(/,/g, '')) : undefined,
    name,
    placeholder,
    selectedAsset,
    ticker,
  };
}