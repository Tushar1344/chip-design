import { Math, BlockMath } from "../../components/math/Math";
import { Callout } from "../../components/book/Callout";
import { VideoDemo } from "../../components/video/VideoDemo";
import { MacBuilderSim } from "../../simulations/MacBuilderSim";

export function Chapter02() {
  return (
    <>
      <p>
        In the last chapter we earned the right to use <Math>0</Math>s and <Math>1</Math>s and any
        logic function we like. Now we spend that on arithmetic — and not just any arithmetic. We are
        going to build the single operation that a neural network performs hundreds of trillions of
        times per second: <strong>multiply two numbers and add the result to a running total</strong>.
      </p>

      <h2 id="adder">Adding with gates</h2>
      <p>
        Binary addition is grade-school addition with only two digits. Adding two bits gives a sum
        and a carry — which is precisely an <code>XOR</code> and an <code>AND</code>:
      </p>
      <BlockMath>{String.raw`\text{sum} = A \oplus B, \qquad \text{carry} = A \cdot B`}</BlockMath>
      <p>
        That is a <em>half adder</em>. Feed the carry from one column into the next and you get a{" "}
        <em>full adder</em>; chain <Math>n</Math> full adders and you can add two{" "}
        <Math>n</Math>-bit numbers. Addition, the first real arithmetic, is just a handful of the
        gates we already built.
      </p>

      <h2 id="multiply">Multiplying</h2>
      <p>
        Multiplication is addition wearing a disguise. To compute <Math>a \times b</Math>, look at
        each bit of <Math>b</Math>: wherever <Math>{String.raw`b_i = 1`}</Math>, add a copy of{" "}
        <Math>a</Math> shifted left by <Math>i</Math> places. These shifted copies are the{" "}
        <em>partial products</em>, and summing them is the whole multiply:
      </p>
      <BlockMath>{String.raw`a \times b = \sum_{i=0}^{n-1} b_i \,(a \ll i)`}</BlockMath>
      <p>
        In the simulator below, toggle the bits of <Math>a</Math> and <Math>b</Math> and watch the
        partial products light up and sum. A multiplier is, physically, just a grid of{" "}
        <code>AND</code> gates (to form each <Math>{String.raw`b_i \cdot a`}</Math>) feeding a tree of
        adders.
      </p>

      <h2 id="mac">The multiply-accumulate</h2>
      <p>
        Bolt a multiplier to an adder and keep the adder&rsquo;s output in a register that feeds back
        into itself. Now each step does
      </p>
      <BlockMath>{String.raw`\text{acc} \leftarrow \text{acc} + a_i \cdot b_i`}</BlockMath>
      <p>
        This is the <strong>multiply-accumulate</strong>, or MAC. Run it over the elements of two
        vectors and the accumulator ends holding their dot product,{" "}
        <Math>{String.raw`\sum_i a_i b_i`}</Math>. Stack many dot products and you have a matrix
        multiply — and a transformer layer, a convolution, an attention score are all, underneath,
        matrix multiplies. The MAC is the atom of machine learning.
      </p>

      <h2 id="builder">MAC builder</h2>
      <p>
        Part 1 below builds a product from partial products; part 2 folds a sequence of products into
        one accumulator. Press <strong>Run</strong> in part 2 to watch a dot product accumulate one
        term per clock.
      </p>

      <MacBuilderSim />

      <Callout label="The big idea">
        <p>
          A neural network is, to first approximation, nothing but MACs. That is why an AI chip is
          essentially a machine for doing as many multiply-accumulates per second as a given amount
          of silicon, power, and memory bandwidth will allow. Hold onto that sentence — the rest of
          the book is its consequences.
        </p>
      </Callout>

      <VideoDemo
        id="mac-dataflow"
        n="2.1"
        caption={
          <>
            Operands <Math>{String.raw`a_i`}</Math> and <Math>{String.raw`b_i`}</Math> streaming into
            a single MAC: multiply, add to the accumulator, repeat. The dot product grows one term at
            a time.
          </>
        }
      />

      <h2 id="takeaway">Why this matters</h2>
      <p>
        One MAC is small and slow. A useful model needs <Math>{String.raw`10^{15}`}</Math> of these
        operations <em>per second</em>. You cannot get there by making one MAC faster — physics caps
        the clock. You get there by building <em>many</em> MACs and keeping every one of them busy.
        The trouble, as the next chapter shows, is not the multiplying. It is feeding them.
      </p>
    </>
  );
}
