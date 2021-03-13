export interface Structure {
  dimensions: Dimension[]
}

export interface Dimension {
  name: DimensionsName
  items: Item[]
}

export interface DimensionsName {
  lang_ru: string;
  lang_en: string;
}

export interface Item {
  id: string
  name: DimensionsName;
  children: ChildrenItem[]
}

export interface ChildrenItem {
  name: DimensionsName;
  id; string
  children: ChildrenItem[]
}
