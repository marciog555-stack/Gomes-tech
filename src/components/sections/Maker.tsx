import { TextPending } from '../Pending'

export default function Maker() {
  return (
    <section id="quem-faz" className="band band-navy">
      <div className="band-content">
        <h2 className="h2-brand text-paper">Quem faz</h2>

        <div className="mt-10 md:mt-14">
          <p className="h3-brand text-paper">Márcio Gomes da Silva</p>
          <p className="body-brand mt-1" style={{ color: 'rgba(245,247,249,0.7)' }}>
            <TextPending tone="dark">Cidade</TextPending>
          </p>
          <p
            className="body-brand measure mt-4"
            style={{ color: 'rgba(245,247,249,0.85)' }}
          >
            Comecei a fazer software depois de ver quanto negócio bom aqui
            perde dinheiro em caderno e em grupo de WhatsApp.
          </p>
        </div>
      </div>
    </section>
  )
}
