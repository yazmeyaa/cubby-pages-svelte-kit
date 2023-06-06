import { writable } from "svelte/store";
import { pb as ApiClient}    from "$lib/pocketbase";
import CommonHelper from "$lib/utils/CommonHelper";
import type {Collection} from 'pocketbase'

export const collections          = writable<Collection[]>([]);
export const activeCollection     = writable<Collection>({} as Collection);
export const isCollectionsLoading = writable(false);

export function changeActiveCollectionById(collectionId: string) {
    collections.update((list) => {
        const found = CommonHelper.findByKey(list, "id", collectionId) as Collection;

        if (found) {
            activeCollection.set(found);
        } else if (list.length) {
            activeCollection.set(list[0]);
        }

        return list;
    });
}

// add or update collection
export function addCollection(collection: Collection) {
    activeCollection.update((current) => {
        return CommonHelper.isEmpty(current?.id) || current.id === collection.id ? collection : current;
    });

    collections.update((list) => {
        CommonHelper.pushOrReplaceByKey(list, collection, "id");
        return CommonHelper.sortCollections(list);
    });
}

export function removeCollection(collection: Collection) {
    collections.update((list) => {
        CommonHelper.removeByKey(list, "id", collection.id);

        activeCollection.update((current) => {
            if (current.id === collection.id) {
                return list[0];
            }
            return current;
        });

        return list;
    });
}

// load all collections (excluding the user profile)
export async function loadCollections(activeId = null) {
    isCollectionsLoading.set(true);

    try {
        let items = await ApiClient.collections.getFullList(200, {
            "sort": "+name",
        })

        items = CommonHelper.sortCollections(items);

        collections.set(items);

        const item = activeId && CommonHelper.findByKey(items, "id", activeId);
        if (item) {
            activeCollection.set(item);
        } else if (items.length) {
            activeCollection.set(items[0]);
        }
        // return items;
    } catch (err) {
        ApiClient.errorResponseHandler(err as Error);
    }

    isCollectionsLoading.set(false);
    
}
