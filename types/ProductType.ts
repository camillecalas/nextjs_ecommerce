export type ProductType = {
	name: string
	image: string
	unit_amount: number | null
	id: string
	quantity?: number | 1
	description: string | null
	metadata: MetadateType
}

type MetadateType = {
	features: string
}