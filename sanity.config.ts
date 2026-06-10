'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { DocumentsIcon } from '@sanity/icons'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemas'
import { BulkImportTool } from './sanity/tools/BulkImportTool'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Foal & Pony',
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Catalogue')
          .items([
            S.listItem()
              .title('All products')
              .child(S.documentTypeList('product').title('All products')),
            S.divider(),
            S.listItem()
              .title('Published')
              .child(
                S.documentList()
                  .title('Published')
                  .filter('_type == "product" && published == true')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Drafts')
              .child(
                S.documentList()
                  .title('Drafts')
                  .filter('_type == "product" && published != true')
                  .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Ages 4 – 7')
              .child(
                S.documentList()
                  .title('Ages 4 – 7')
                  .filter('_type == "product" && ageBand == "4-7"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Ages 8 – 12')
              .child(
                S.documentList()
                  .title('Ages 8 – 12')
                  .filter('_type == "product" && ageBand == "8-12"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Ages 13 +')
              .child(
                S.documentList()
                  .title('Ages 13 +')
                  .filter('_type == "product" && ageBand == "13+"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  tools: (prev) => [
    ...prev,
    {
      name: 'bulk-import',
      title: 'Bulk import',
      icon: DocumentsIcon,
      component: BulkImportTool,
    },
  ],
})
