import { Handler, StatusCodes } from '~/types'
import { SpecieRoute } from './route-schemas'
import { SpecieUseCase } from '$specie/application'

class SpecieCtrl {
	#useCase: SpecieUseCase
	constructor(useCase: SpecieUseCase) {
		this.#useCase = useCase
	}

	list: Handler<SpecieRoute.Find> = async (req, rep) => {
		const { filter = {}, order = {} } = req.query

		const page = { ...req.query.page, start: 0, limit: 10 }

		const data = await this.#useCase.list({ page, filter, order })

		const MIN_START = 0
		const PREV_START = page.start - page.limit
		const NEXT_START = (page.start as number) + (page.limit as number)

		const species = {
			status: StatusCodes.OK,
			data,
			pagination: {
				prev:
					PREV_START > MIN_START
						? req.url.replace(/(?<=start=)(\d+)/, `${PREV_START}`)
						: undefined,
				self: req.url,
				next: req.url.replace(/(?<=start=)(\d+)/, `${NEXT_START}`),
			},
		}
		return species
	}
}

export { SpecieCtrl }
