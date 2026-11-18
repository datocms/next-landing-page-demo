import { ResponsiveImageFragment } from '@/components/datocms/DatoImage/fragment';
import {
  IconCardFragment,
  ListCardFragment,
  MetricsCardFragment,
} from '@/components/product/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const HeroSectionFragment = graphql(
  /* GraphQL */ `
    fragment HeroSectionFragment on HeroSectionBlockRecord {
      buttons {
        id
        label
        primary
        url
      }
      title
      subtitle {
        value
      }
      # One short line shown as a pill above the title
      announcement {
        value
      }
      # A short badge before the announcement, for example New
      announcementLabel
      layout
      # split only: both images are cropped to tall capsules around their focal point
      image {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: { w: "500", h: "1192", fit: crop, auto: format }
        ) {
          ...ResponsiveImageFragment
        }
      }
      # cover only: the same image, wide, filling the panel behind the copy
      cover: image {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: { w: "1600", h: "900", fit: crop, auto: format }
        ) {
          ...ResponsiveImageFragment
        }
      }
      secondaryImage {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: { w: "316", h: "824", fit: crop, auto: format }
        ) {
          ...ResponsiveImageFragment
        }
      }
      # statement and mosaic: both images as portrait crops (the arches, the mosaic's tall tile)
      portrait: image {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: { w: "640", h: "800", fit: crop, auto: format }
        ) {
          ...ResponsiveImageFragment
        }
      }
      secondaryPortrait: secondaryImage {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: { w: "640", h: "800", fit: crop, auto: format }
        ) {
          ...ResponsiveImageFragment
        }
      }
      # mosaic only: the image as the large square tile
      square: image {
        focalPoint {
          x
          y
        }
        responsiveImage(
          imgixParams: { w: "800", h: "800", fit: crop, auto: format }
        ) {
          ...ResponsiveImageFragment
        }
      }
      # split only: small pieces of the product over the images, and a short highlight in a pill
      productCards {
        __typename
        ... on MetricsCardBlockRecord {
          id
          ...MetricsCardFragment
        }
        ... on ListCardBlockRecord {
          id
          ...ListCardFragment
        }
        ... on IconCardBlockRecord {
          id
          ...IconCardFragment
        }
      }
      highlight
    }
  `,
  [
    ResponsiveImageFragment,
    MetricsCardFragment,
    ListCardFragment,
    IconCardFragment,
  ],
);
