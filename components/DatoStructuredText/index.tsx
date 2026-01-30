import Highlighter from '@/components/Highlighter';
import type { ReactElement } from 'react';
import {
  StructuredText,
  type StructuredTextPropTypes,
  type CdaStructuredTextRecord,
} from 'react-datocms/structured-text';

export default function DatoStructuredText<
  BlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  LinkRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  InlineBlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
>(
  props: StructuredTextPropTypes<BlockRecord, LinkRecord, InlineBlockRecord>,
) {
  const { renderBlock, renderNode, ...rest } = props;

  return (
    <div data-datocms-content-link-group>
      <StructuredText
        {...rest}
        renderNode={renderNode ?? Highlighter}
        renderBlock={
          renderBlock
            ? (ctx) => {
                const result: ReactElement | null = renderBlock(ctx);
                if (!result) return null;
                return (
                  <div data-datocms-content-link-boundary key={result.key}>
                    {result}
                  </div>
                );
              }
            : undefined
        }
      />
    </div>
  );
}
