import Highlighter from '@/components/Highlighter';
import { cloneElement, type ReactElement } from 'react';
import {
  StructuredText,
  type StructuredTextPropTypes,
  type CdaStructuredTextRecord,
} from 'react-datocms/structured-text';

function wrapBlockWithBoundary(
  result: ReactElement | null,
): ReactElement | null {
  if (!result) return null;
  return (
    <div data-datocms-content-link-boundary key={result.key}>
      {result}
    </div>
  );
}

function addBoundaryAttribute(
  result: ReactElement | null,
): ReactElement | null {
  if (!result) return null;
  return cloneElement(result, {
    'data-datocms-content-link-boundary': true,
  });
}

export default function DatoStructuredText<
  BlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  LinkRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  InlineBlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
>(
  props: StructuredTextPropTypes<BlockRecord, LinkRecord, InlineBlockRecord>,
) {
  const {
    renderBlock,
    renderInlineRecord,
    renderLinkToRecord,
    renderNode,
    ...rest
  } = props;

  return (
    <div data-datocms-content-link-group>
      <StructuredText
        {...rest}
        renderNode={renderNode ?? Highlighter}
        renderBlock={
          renderBlock
            ? (ctx) => wrapBlockWithBoundary(renderBlock(ctx))
            : undefined
        }
        renderInlineRecord={
          renderInlineRecord
            ? (ctx) => addBoundaryAttribute(renderInlineRecord(ctx))
            : undefined
        }
        renderLinkToRecord={renderLinkToRecord}
      />
    </div>
  );
}
