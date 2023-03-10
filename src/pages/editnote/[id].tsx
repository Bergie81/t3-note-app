import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "../../utils/api";

interface FormData {
  title: string;
  description: string;
  id: string;
}

const Editnote: NextPage = () => {
  const utils = api.useContext();
  const [data, setData] = useState<FormData>({
    title: "",
    description: "",
    id: "",
  });
  const router = useRouter();
  const NotesId = router.query.id as string;
  const { data: messageDetail } = api.mynotes?.detailNote.useQuery({
    id: NotesId,
  });

  useEffect(() => {
    setData({
      title: messageDetail?.title,
      description: messageDetail?.description,
      id: messageDetail?.id,
    });
  }, []);

  const updateNewNote = api.mynotes.updateNote.useMutation({
    onMutate: () => {
      utils.mynotes.allNotes.cancel();
      const optimisticUpdate = utils.mynotes.allNotes.getData();

      if (optimisticUpdate) {
        utils.mynotes.allNotes.setData(optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.mynotes.allNotes.invalidate();
      utils.mynotes.detailNote.invalidate();
    },
  });

  const handelDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setData({
      ...data,
      description: event.target.value,
    });
  };

  const handelTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      title: event.target.value,
    });
  };

  return (
    <>
      <Head>
        <title>Edit Note</title>
        <meta name="description" content="Edit Note" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen flex-col justify-center py-10 md:container">
        <Link
          className="indigo-700 inline-block py-4 text-base font-semibold leading-7 text-purple-700"
          href="/"
        >
          Go back
        </Link>
        <h1 className="mb-6 text-left text-3xl font-bold tracking-tight text-gray-900">
          Edit your note
        </h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateNewNote.mutate({
              title: data.title,
              description: data.description,
              id: data.id,
            });
            setData({
              title: "",
              description: "",
              id: "",
            });
          }}
        >
          <input
            type="text"
            required
            value={data?.title}
            placeholder="Your title"
            onChange={(event) => handelTitleChange(event)}
            className="border-1 mb-2 block w-full rounded-sm border-purple-800 bg-neutral-100 px-4 py-2 focus:outline-none"
          />
          <textarea
            required
            value={data?.description}
            placeholder="Your description"
            onChange={(event) => handelDescriptionChange(event)}
            className="border-1 mb-2 block w-full rounded-sm border-purple-800 bg-neutral-100 px-4 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="block w-full rounded-lg bg-purple-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-purple-600 hover:bg-purple-700 hover:ring-purple-700"
          >
            Edit note
          </button>
        </form>
      </main>
    </>
  );
};

export default Editnote;
