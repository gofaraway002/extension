import { memo } from 'react';
import { useField } from 'formik';
import { Box, ChevronIcon, Text, color, Stack, BoxProps } from '@stacks/ui';

import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';
import { Caption } from '@app/components/typography';
import { useSelectedAssetBalance } from '@app/pages/send-tokens/hooks/use-selected-asset-balance';
import {
  getGradientString,
  getImageCanonicalUri,
} from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { getStacksFungibleTokenCurrencyAsset } from '@app/query/stacks/balance/crypto-asset-balances.utils';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

interface SelectedAssetItemProps extends BoxProps {
  hideArrow?: boolean;
  onClearSearch(): void;
}
export const SelectedAssetItem = memo(
  ({ hideArrow, onClearSearch, ...rest }: SelectedAssetItemProps) => {
    const [field] = useField('assetId');
    const { isStx, name, selectedAssetBalance, ticker } = useSelectedAssetBalance(field.value);
    const tokenCurrencyAsset = getStacksFungibleTokenCurrencyAsset(selectedAssetBalance);
    const gradientString = tokenCurrencyAsset ? getGradientString(tokenCurrencyAsset) : '';
    const imageCanonicalUri = tokenCurrencyAsset
      ? getImageCanonicalUri(tokenCurrencyAsset.imageCanonicalUri, tokenCurrencyAsset.name)
      : '';

    return (
      <Box
        width="100%"
        px="base"
        py="base-tight"
        borderRadius="8px"
        border="1px solid"
        borderColor={color('border')}
        userSelect="none"
        onClick={() => !hideArrow && onClearSearch()}
        {...rest}
      >
        <Stack spacing="base" alignItems="center" isInline>
          <StacksAssetAvatar
            color="white"
            gradientString={gradientString}
            imageCanonicalUri={imageCanonicalUri}
            isStx={isStx}
            mr="tight"
            size="36px"
          >
            {name?.[0]}
          </StacksAssetAvatar>
          <Stack flexGrow={1}>
            <Text
              display="block"
              fontWeight="400"
              fontSize={2}
              color="ink.1000"
              data-testid={SendFormSelectors.SelectedAssetOption}
            >
              {name}
            </Text>
            <Caption>{ticker}</Caption>
          </Stack>
          {!hideArrow && (
            <Box ml="base" textAlign="right" height="24px">
              <ChevronIcon
                size="24px"
                direction="down"
                cursor="pointer"
                opacity={0.7}
                onClick={() => onClearSearch()}
              />
            </Box>
          )}
        </Stack>
      </Box>
    );
  }
);
