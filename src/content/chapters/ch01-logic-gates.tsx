import { Math, BlockMath } from "../../components/math/Math";
import { Callout } from "../../components/book/Callout";
import { VideoDemo } from "../../components/video/VideoDemo";
import { LogicGateSim } from "../../simulations/LogicGateSim";

export function Chapter01() {
  return (
    <>
      <p>
        A modern AI accelerator has tens of billions of transistors, runs matrix multiplies at the
        speed of light through silicon, and looks, from the outside, like magic. It is not magic. It
        is one trick — turning electricity into <em>truth values</em> — repeated at an inhuman scale.
        This book builds the whole machine from that single trick. We start at the very bottom: a
        switch.
      </p>

      <h2 id="switch">The switch</h2>
      <p>
        A transistor is a switch with no moving parts. A small voltage on its <em>gate</em> terminal
        decides whether current may flow between the other two. Call &ldquo;voltage present&rdquo;{" "}
        <Math>1</Math> and &ldquo;voltage absent&rdquo; <Math>0</Math>, and you have stopped doing
        electronics and started doing logic. Everything above this line is built only from{" "}
        <Math>0</Math> and <Math>1</Math> and the rules for combining them.
      </p>
      <p>
        The reason chips are digital — two voltages, not a continuum — is noise. If a wire only ever
        has to be &ldquo;clearly high&rdquo; or &ldquo;clearly low,&rdquo; a little electrical
        smudging never changes the answer. Two well-separated levels are the cheapest reliable thing
        physics will sell you.
      </p>

      <h2 id="gates">From switches to gates</h2>
      <p>
        Wire a handful of switches together and they compute a function of their inputs. These are{" "}
        <strong>logic gates</strong>. An <code>AND</code> gate outputs <Math>1</Math> only when both
        inputs are <Math>1</Math>; an <code>OR</code> when at least one is; a <code>NOT</code> flips
        its single input. Two inputs give four possible input rows, and a gate is completely defined
        by what it outputs on each:
      </p>
      <BlockMath>{String.raw`\text{XOR}(A,B) = A \oplus B = \begin{cases} 1 & A \neq B \\ 0 & A = B \end{cases}`}</BlockMath>
      <p>
        That is the entire definition of a gate — a tiny truth table. The art of chip design is
        choosing which tables to build and how to wire their outputs into the inputs of the next.
      </p>

      <h2 id="universal">One gate to rule them all</h2>
      <p>
        Here is the first surprise that makes large-scale design tractable: you do not need a zoo of
        gates. A single gate type, <code>NAND</code> (&ldquo;not-and&rdquo;), is{" "}
        <strong>functionally complete</strong> — every other logic function can be assembled purely
        from <code>NAND</code>s. Below, four of them are wired into an <code>XOR</code>. Toggle the
        inputs and watch the high signal (teal) thread its way to the output.
      </p>

      <LogicGateSim />

      <Callout>
        <p>
          Because one repeated part can express any logic at all, manufacturing becomes a game of
          stamping out billions of identical tiny things. Uniformity is what makes the scale
          possible — and it is a theme we will meet again when thousands of identical arithmetic
          units get tiled into an array.
        </p>
      </Callout>

      <h2 id="playground">Gate playground</h2>
      <p>
        Switch the figure above to <strong>Gates</strong> mode to see all six common two-input gates
        respond at once to the same <Math>A</Math> and <Math>B</Math>. Notice that{" "}
        <code>NAND</code> and <code>NOR</code> are just <code>AND</code> and <code>OR</code> with the
        output inverted — bubbles on a circuit diagram are free, which is exactly why inverting gates
        are the cheapest to build in silicon.
      </p>

      <VideoDemo
        id="gate-propagation"
        n="1.1"
        caption={
          <>
            A signal edge propagating through a small gate network, one gate delay at a time. Each
            gate adds a little latency; chained deeply enough, that latency is what sets a chip&rsquo;s
            clock speed.
          </>
        }
      />

      <h2 id="takeaway">Why this matters</h2>
      <p>
        We now have a way to compute <em>any</em> boolean function from one repeated part, and a
        reason the whole enterprise is digital. That is the foundation. In the next chapter we pick a
        specific, wildly important function to build out of these gates — the one operation that
        every neural network spends nearly all of its time doing — and discover that arithmetic falls
        out of logic almost for free.
      </p>
    </>
  );
}
