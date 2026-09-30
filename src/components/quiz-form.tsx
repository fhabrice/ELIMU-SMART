'use client';

import { useActionState } from 'react';
import { submitQuizAction, type QuizState } from '@/lib/actions/learning';
import type { QuizQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';

export function QuizForm({
  slug,
  quizTitle,
  passingScore,
  questions,
  labels,
}: {
  slug: string;
  quizTitle: string;
  passingScore: number;
  questions: QuizQuestion[];
  labels: { submit: string; passed: string; failed: string; result: string; explanation: string; retake: string };
}) {
  const [state, formAction] = useActionState<QuizState, FormData>(submitQuizAction, { ok: false });
  const corrections = new Map((state.corrections ?? []).map((item) => [item.questionId, item]));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{quizTitle}</h3>
          <p className="text-sm text-slate-500">
            {questions.length} questions · note de réussite : {passingScore} %
          </p>
        </div>
        {state.ok && typeof state.score === 'number' && (
          <div
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-bold',
              state.passed ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900',
            )}
          >
            {labels.result} : {state.score} % — {state.passed ? labels.passed : labels.failed}
          </div>
        )}
      </div>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="slug" value={slug} />

        {questions.map((question, index) => {
          const correction = corrections.get(question.id);
          return (
            <fieldset
              key={question.id}
              className={cn(
                'rounded-xl border p-4',
                correction
                  ? correction.given === correction.correctIndex
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-rose-300 bg-rose-50/50'
                  : 'border-slate-200 bg-white',
              )}
            >
              <legend className="px-1 text-sm font-semibold text-slate-800">
                {index + 1}. {question.prompt}
              </legend>
              <div className="mt-3 space-y-2">
                {question.choices.map((choice, choiceIndex) => (
                  <label
                    key={choiceIndex}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition',
                      correction && choiceIndex === correction.correctIndex
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-elimu-300 hover:bg-elimu-50/40',
                    )}
                  >
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={choiceIndex}
                      defaultChecked={correction?.given === choiceIndex}
                      className="mt-0.5 h-4 w-4 border-slate-300 text-elimu-700 focus:ring-elimu-400"
                    />
                    <span className="text-slate-700">{choice}</span>
                  </label>
                ))}
              </div>
              {correction && (
                <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs text-slate-600">
                  <strong>{labels.explanation} :</strong> {correction.explanation}
                </p>
              )}
            </fieldset>
          );
        })}

        <button type="submit" className="btn-primary">
          {state.ok ? labels.retake : labels.submit}
        </button>
      </form>
    </div>
  );
}
