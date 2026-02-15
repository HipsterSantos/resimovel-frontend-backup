import { truncateWords } from "."

let steps = [
    {
        title: "Dados do imóvel",
        description: "É essencial colocar os dados corretos do imóvel para facilitar o cliente. Isso inclui informações precisas como localização, tamanho, número de quartos, banheiros, área total, e outras características relevantes. Certifique-se de que todos os detalhes estão atualizados e corretos para evitar qualquer confusão ou mal-entendido. Informações precisas ajudam a construir confiança com o cliente e podem acelerar o processo de tomada de decisão.",
        active: true,
    },
    {
        title: "Nos fale um pouco sobre você",
        description: "Acrescenta a descrição completa até os mínimos detalhes para melhor compreensão. Inclua informações detalhadas sobre o acabamento, materiais utilizados, idade do imóvel, condições atuais, e qualquer reforma recente que tenha sido realizada. Detalhes sobre a vizinhança, proximidade a serviços essenciais como escolas, hospitais, e transporte público também são importantes. Uma descrição completa e detalhada ajuda os potenciais compradores a terem uma visão clara do que esperar.",
        active: false
    },
    {
        title: "Detalhes do imóvel",
        description: "Acrescenta a descrição completa até os mínimos detalhes para melhor compreensão. Inclua informações detalhadas sobre o acabamento, materiais utilizados, idade do imóvel, condições atuais, e qualquer reforma recente que tenha sido realizada. Detalhes sobre a vizinhança, proximidade a serviços essenciais como escolas, hospitais, e transporte público também são importantes. Uma descrição completa e detalhada ajuda os potenciais compradores a terem uma visão clara do que esperar.",
        active: false
    },
    {
        title: "Multimédia",
        description: "Adicione apenas imagens reais do imóvel; imagens com qualidade chamam a atenção dos clientes. Fotografias de alta qualidade, tiradas sob boa iluminação, podem realçar os melhores aspectos do imóvel. Considere incluir fotos de todos os cômodos, bem como do exterior e de qualquer área comum. Vídeos ou tours virtuais também podem ser extremamente eficazes para proporcionar uma visão mais completa. Imagens e vídeos de alta qualidade podem fazer uma grande diferença na percepção do imóvel.",
        active: false
    },
    {
        title: "Escolha um de nossos planos (Finalizar)",
        description: "Coloque o imóvel em destaque para maior visibilidade. Destacar o imóvel em plataformas de anúncios ou listas de imóveis pode aumentar significativamente a visibilidade. Considere destacar características únicas ou vantagens competitivas que o imóvel possa ter, como uma localização privilegiada, vista panorâmica, amenidades exclusivas, ou preço competitivo. Destaques ajudam a captar a atenção de potenciais compradores rapidamente, aumentando as chances de venda.",
        active: false
    }
]
steps = steps.map(item => ({
    ...item,
    description: truncateWords(item.description, 350)
}));

export default steps