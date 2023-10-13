import { DocumentIcon } from '@sanity/icons'
import { defineField } from 'sanity'
import { validateSlug } from '../../utils/validateSlug'

export default defineField({
    name: 'category',
    title: 'Category',
    type: 'document',
    icon: DocumentIcon,
    fields: [
        // Title
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        // Slug
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            // @ts-ignore - TODO - fix this TS error
            validation: validateSlug,
        }),
    ],
    preview: {
        select: {
            title: 'title',
        },
        prepare(selection) {
            const { title } = selection

            return {
                title,
            }
        },
    },
})
