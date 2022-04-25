import { mascaraMoeda, maskCurrency} from './../app.js'

describe('Testing app', () => {
    it('Testing mask', () => {
        expect(mascaraMoeda(1267).toBe("R$ 12,67"))
    })
}) 