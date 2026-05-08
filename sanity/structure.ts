import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings", "resume"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .schemaType("siteSettings")
        .child(
          S.document()
            .title("Site Settings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      S.listItem()
        .title("Resume")
        .id("resume")
        .schemaType("resume")
        .child(
          S.document().title("Resume").schemaType("resume").documentId("resume")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() || "")
      ),
    ]);