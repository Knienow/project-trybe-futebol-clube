// tipo auxiliar para representar somente os atributos recebidos na criação
// de um novo time (o famoso body da requisição). Usado para criar novas entidades
// no banco de dados - remove o campo id do objeto
export type NewEntity<T> = Omit<T, 'id'>;

export type ID = number;

export type Identifiable = { id: ID };
