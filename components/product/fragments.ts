import { graphql } from '@/lib/datocms/graphql';

/** A figure with its label and, optionally, its change */
export const MetricFragment = graphql(/* GraphQL */ `
  fragment MetricFragment on MetricBlockRecord {
    id
    label
    value
    change
  }
`);

/** One to three figures over a small chart */
export const MetricsCardFragment = graphql(
  /* GraphQL */ `
    fragment MetricsCardFragment on MetricsCardBlockRecord {
      id
      chart
      metrics {
        ...MetricFragment
      }
    }
  `,
  [MetricFragment],
);

/** A short list of rows: bars, a funnel, people or tags */
export const ListCardFragment = graphql(/* GraphQL */ `
  fragment ListCardFragment on ListCardBlockRecord {
    id
    title
    style
    rows {
      id
      label
      value
      share
      highlighted
    }
  }
`);

/** A short message with a few figures under it */
export const MessageCardFragment = graphql(
  /* GraphQL */ `
    fragment MessageCardFragment on MessageCardBlockRecord {
      id
      title
      timeLabel
      text {
        value
      }
      metrics {
        ...MetricFragment
      }
    }
  `,
  [MetricFragment],
);

/** An icon beside a few words: a feature said plainly, without figures */
export const IconCardFragment = graphql(/* GraphQL */ `
  fragment IconCardFragment on IconCardBlockRecord {
    id
    title
    text
    icon {
      url
      alt
    }
  }
`);
