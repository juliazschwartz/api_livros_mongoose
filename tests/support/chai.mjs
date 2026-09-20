import * as chaiModule from 'chai';
import chaiHttp from 'chai-http';

// chai.use(plugin) só aplica o plugin uma vez por processo (por identidade da
// função); chamar isso em cada arquivo de teste faz o segundo arquivo receber
// um chai sem o `.request`. Centralizando aqui, o `use` roda uma única vez e
// todos os testes importam a mesma instância já configurada.
const chai = chaiModule.use(chaiHttp);
chai.should();

export default chai;
